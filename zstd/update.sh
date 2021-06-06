# CWD
cd zstd

# Update repository
git clone https://github.com/facebook/zstd.git zstd
cd zstd
git checkout -b v1.5.0
cd ..

# Update C
bash ./zstd/build/single_file_libs/combine.sh -r ./zstd/lib -o zstd.c ./zstd/build/single_file_libs/zstddeclib-in.c

# Update WASM (Speed)
emcc zstd.c -O3 -s EXPORTED_FUNCTIONS="['_ZSTD_decompress', '_ZSTD_findDecompressedSize', '_malloc', '_free']" -s ALLOW_MEMORY_GROWTH=1 --no-entry -o zstd.speed.wasm

# Update WASM.zst (Speed)
zstd -19 zstd.speed.wasm

# Update JS (Speed)
echo "module.exports = '$(base64 zstd.speed.wasm)';" > zstd.speed.js

# Update WASM (Size)
emcc zstd.c -Oz -s EXPORTED_FUNCTIONS="['_ZSTD_decompress', '_ZSTD_findDecompressedSize', '_malloc', '_free']" -s ALLOW_MEMORY_GROWTH=1 --no-entry -o zstd.size.wasm

# Update WASM.zst (Size)
zstd -19 zstd.size.wasm

# Update JS (Size)
echo "module.exports = '$(base64 zstd.size.wasm)';" > zstd.size.js

# Cleanup
rm -rf zstd
