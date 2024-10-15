import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts";
// import { Command } from "cliffy/command";

// @ts-ignore Set debug from env var
globalThis.debug = Deno.env.get("DEBUG") ?? false;

class JsonTransformStream extends TransformStream {
  constructor() {
    super({
      transform: (chunk, controller) => {
        try {
          const json = JSON.parse(chunk);
          controller.enqueue(json);
        } catch (e) {
          console.error(e);
          controller.enqueue(chunk.replaceAll(":", "="));
        }
      },
    });
  }
}

class DotEnvTransformStream extends TransformStream {
  constructor() {
    super({
      transform: (chunk, controller) => {
        if (chunk instanceof Object) {
          controller.enqueue(
            Object.entries(chunk).map(([k, v]) => `${k}=${v}`).join("\n"),
          );
        }
      },
    });
  }
}

let stream_in = Deno.stdin.readable, stream_out = Deno.stdout.writable;
if (Deno.stdin.isTerminal()) {
  const { options, args } = await new Command()
    .name("dotenv")
    .version("0.1.0")
    .description("Transform a JSON env file into dotenv file")
    .env("DEBUG=<enable:boolean>", "Enable debug output")
    .option("-d, --debug", "Enable debug output")
    .arguments("<jsonFile:string> [output:string]")
    .parse(Deno.args);
  // @ts-ignore Set global debug var for logging
  globalThis.debug = options.debug;
  const inputFile = await Deno.open(args[0], { read: true });
  stream_in = inputFile.readable;
  const outFile = await Deno.open(args?.[1] ?? ".env", {
    write: true,
    create: true,
  });
  stream_out = outFile.writable;
} else {
  stream_in = Deno.stdin.readable;
  stream_out = Deno.stdout.writable;
}

await stream_in
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new JsonTransformStream())
  .pipeThrough(new DotEnvTransformStream())
  .pipeThrough(new TextEncoderStream())
  .pipeTo(stream_out);
