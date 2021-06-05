

/* MAIN */

//TODO: Maybe publish this as a standalone module

const decode = ( base64: string ): ArrayBufferLike => {

  if ( typeof atob === 'function' ) { // Browser

    const binary = atob ( base64 );
    const bytes = new Uint8Array ( binary.length );

    for ( let i = 0, l = binary.length; i < l; i++ ) {

      bytes[i] = binary.charCodeAt ( i );

    }

    return bytes.buffer;

  } else { // Node.js

    return Buffer.from ( base64, 'base64' ).buffer;

  }

};

/* EXPORT */

export default decode;
