
/* IMPORT */

import {describe} from 'fava';
import fs from 'node:fs';
import zsize from '../dist/size.js';
import zspeed from '../dist/speed.js';

/* MAIN */

describe ( 'zstandard', () => {

  for ( const [zstandard, name] of [[zsize, 'size'], [zspeed, 'speed']] ) {

    describe ( name, it => {

      it ( 'works', async t => {

        await zstandard.loadWASM ();

        const original = fs.readFileSync ( './zstd/zstd.size.wasm' );
        const compressed = fs.readFileSync ( './zstd/zstd.size.wasm.zst' );
        const decompressed = zstandard.decompress ( compressed );

        t.true ( original.equals ( decompressed ) );

      });

    });

  }

});
