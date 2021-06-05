# CWD
cd zstd

# Update repository
git clone https://github.com/facebook/zstd.git zstd
cd zstd
git checkout -b v1.5.0
cd ..

# Update C
bash ./zstd/build/single_file_libs/combine.sh -r ./zstd/lib -o zstd.c ./zstd/build/single_file_libs/zstddeclib-in.c

# Update WASM
emcc zstd.c -O3 -s EXPORTED_FUNCTIONS="['_ZSTD_decompress', '_ZSTD_findDecompressedSize', '_malloc', '_free']" -s ALLOW_MEMORY_GROWTH=1 --no-entry -o zstd.wasm

# Update WASM.zst
zstd -19 zstd.wasm

# Update JS
echo "module.exports = '$(base64 zstd.wasm)';" > zstd.js

# Cleanup
rm -rf zstd
