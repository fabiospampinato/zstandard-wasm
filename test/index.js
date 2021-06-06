
/* IMPORT */

const fs = require ( 'fs' );
const {default: zindex} = require ( '..' );
const {default: zsize} = require ( '../size' );
const {default: zspeed} = require ( '../speed' );

/* MAIN */

const test = async zstd => {

  await zstd.loadWASM ();

  const original = fs.readFileSync ( './zstd/zstd.size.wasm' );
  const compressed = fs.readFileSync ( './zstd/zstd.size.wasm.zst' );
  const decompressed = zstd.decompress ( compressed );

  console.log ( original.equals ( decompressed ), 'Decompression works' );

};

test ( zindex );
test ( zsize );
test ( zspeed );
