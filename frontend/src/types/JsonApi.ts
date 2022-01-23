/* eslint-disable @typescript-eslint/no-namespace */

// TODO: there really needs to be a description of the full response (which
// has `data`, `meta`, etc. as root keys)

namespace JsonApi {
  export interface Document<
    Type extends string,
    Attributes extends Record<string, any>,
    Relationships extends undefined | Record<string, Document<any, any, any> | Document<any, any, any>[]> = undefined,
    // Meta extends undefined | Record<string, any> = undefined,
  > {
    id: string;
    type: Type;
    attributes: Attributes;
    relationships?: {
      [key in keyof Relationships]: {
        data: Relationships[key]
      }
    };
    // meta?: Meta; // this actually exists outside of the document here
  }
}

export default JsonApi;
