/* eslint-disable @typescript-eslint/no-namespace */

import { Require } from "@/types/common";

// TODO: there really needs to be a description of the full response (which
// has `data`, `meta`, etc. as root keys)

namespace JsonApi {
  // Where specified, a meta member can be used to include non-standard meta-information
  export type Meta = Record<string, any>;

  // export interface Document<
  //   Type extends string,
  //   Attributes extends Record<string, any>,
  //   Relationships extends undefined | Record<string, Document<any, any, any> | Document<any, any, any>[]> = undefined,
  //   // Meta extends undefined | Record<string, any> = undefined,
  // > {
  //   id: string;
  //   type: Type;
  //   attributes: Attributes;
  //   relationships?: {
  //     [key in keyof Relationships]: {
  //       data: Relationships[key]
  //     }
  //   };
  //   // meta?: Meta; // this actually exists outside of the document here
  // }

  // - a string containing the link’s URL, or
  // - an object (“link object”) which can contain the following members:
  //     href: a string containing the link’s URL.
  //     meta: a meta object containing non-standard meta-information about the link.
  export type Link = string | {
    href: string;
    meta?: Meta;
  };

  // self: the link that generated the current response document.
  // related: a related resource link when the primary data represents a resource relationship.
  // ...pagination links for the primary data.
  export type ResourceLinkMembers = "self" | "related";
  export type PaginationLinkMembers = "first" | "last" | "prev" | "next";
  export type LinkMembers = ResourceLinkMembers | PaginationLinkMembers;
  export type LinksCollection<M extends LinkMembers | never = never> = Require<Partial<Record<LinkMembers, Link>>, M>;

  // version: a string indicating the highest JSON API version supported.
  // meta: a meta object that contains non-standard meta-information.
  export interface JsonApiDetails {
    version?: string;
    meta?: Meta;
  }

  // jsonapi: an object describing the server’s implementation
  // links: a links object related to the primary data.
  // meta: a meta object that contains non-standard meta-information.
  interface CommonResponseProperties<
    L extends LinksCollection | undefined = LinksCollection | undefined,
    M extends Meta | undefined = Meta | undefined,
  > {
    jsonapi?: JsonApiDetails;
    links: L;
    meta: M;
  }

  // Attributes may contain any valid JSON value.
  export type Attributes = Record<string, any>;

  // links: a links object containing at least one of the following:
  //   self: a link for the relationship itself (a “relationship link”). This link allows the client to directly manipulate the relationship. For example, removing an author through an article’s relationship URL would disconnect the person from the article without deleting the people resource itself. When fetched successfully, this link returns the linkage for the related resources as its primary data. (See Fetching Relationships.)
  //   related: a related resource link
  // meta: a meta object that contains non-standard meta-information about the relationship.
  interface CommonRelationshipDetailsProperties {
    links?: LinksCollection;
    meta?: Meta;
  }

  // data: resource linkage
  export interface ItemRelationshipDetails extends CommonRelationshipDetailsProperties {
    data: ResourceIdentifier | null;
  }

  // data: resource linkage
  export interface CollectionRelationshipDetails extends CommonRelationshipDetailsProperties {
    data: ResourceIdentifier[];
  }

  // links: a links object containing at least one of the following:
  //   self: a link for the relationship itself (a “relationship link”). This link allows the client to directly manipulate the relationship. For example, removing an author through an article’s relationship URL would disconnect the person from the article without deleting the people resource itself. When fetched successfully, this link returns the linkage for the related resources as its primary data. (See Fetching Relationships.)
  //   related: a related resource link
  // data: resource linkage
  // meta: a meta object that contains non-standard meta-information about the relationship.
  export type RelationshipDetails = ItemRelationshipDetails | CollectionRelationshipDetails;

  // [index: string]:
  //   links: a links object containing at least one of the following:
  //     self: a link for the relationship itself (a “relationship link”). This link allows the client to directly manipulate the relationship. For example, removing an author through an article’s relationship URL would disconnect the person from the article without deleting the people resource itself. When fetched successfully, this link returns the linkage for the related resources as its primary data. (See Fetching Relationships.)
  //     related: a related resource link
  //   data: resource linkage
  //   meta: a meta object that contains non-standard meta-information about the relationship.
  export type Relationships<T extends Record<string, RelationshipDetails> = Record<string, RelationshipDetails>> = T;

  // // attributes: an attributes object representing some of the resource’s data.
  // // relationships: a relationships object describing relationships between the resource and other JSON:API resources.
  // // links: a links object containing links related to the resource.
  // // meta: a meta object containing non-standard meta-information about a resource that can not be represented as an attribute or relationship.
  // export interface ResourceData {
  //   id: string;
  //   type: string;
  //   attributes?: Attributes;
  //   relationships?: Relationships;
  //   links?: LinksCollection;
  //   meta?: Meta;
  // }

  // attributes: an attributes object representing some of the resource’s data.
  // relationships: a relationships object describing relationships between the resource and other JSON:API resources.
  // links: a links object containing links related to the resource.
  // meta: a meta object containing non-standard meta-information about a resource that can not be represented as an attribute or relationship.
  export interface ResourceData<
    T extends string = string,
    A extends Attributes | undefined = Attributes | undefined,
    R extends Relationships | undefined = Relationships | undefined,
    L extends LinksCollection | undefined = LinksCollection | undefined,
    M extends Meta | undefined = Meta | undefined,
  > {
    id: string;
    type: T;
    attributes: A;
    relationships: R;
    links: L;
    meta: M;
  }

  // meta: a meta object that contains non-standard meta-information.
  export interface ResourceIdentifier {
    id: string;
    type: string;
    meta?: Meta;
  }

  // // data: the document’s “primary data”
  // // included: an array of resource objects that are related to the primary data and/or each other (“included resources”).
  // export interface ItemResponse extends CommonResponseProperties {
  //   data: ResourceData | ResourceIdentifier | null;
  //   included?: ResourceData[];
  // }

  // data: the document’s “primary data”
  // included: an array of resource objects that are related to the primary data and/or each other (“included resources”).
  export interface ItemResponse<
    D extends ResourceData | ResourceIdentifier | null = ResourceData | ResourceIdentifier | null,
    I extends ResourceData[] | undefined = ResourceData[] | undefined,
    L extends LinksCollection | undefined = LinksCollection | undefined,
    M extends Meta | undefined = Meta | undefined,
  > extends CommonResponseProperties<L, M> {
    data: D;
    included: I;
  }

  // // data: the document’s “primary data”
  // // included: an array of resource objects that are related to the primary data and/or each other (“included resources”).
  // export interface CollectionResponse extends CommonResponseProperties {
  //   data: ResourceData[] | ResourceIdentifier[];
  //   included?: ResourceData[];
  // }

  // data: the document’s “primary data”
  // included: an array of resource objects that are related to the primary data and/or each other (“included resources”).
  export interface CollectionResponse<
    D extends ResourceData[] | ResourceIdentifier[] = ResourceData[] | ResourceIdentifier[],
    I extends ResourceData[] | undefined = ResourceData[] | undefined,
    L extends LinksCollection | undefined = LinksCollection | undefined,
    M extends Meta | undefined = Meta | undefined,
  > extends CommonResponseProperties<L, M> {
    data: D;
    included: I;
  }

  export type SuccessResponse<
    D extends ResourceData | ResourceIdentifier | null = ResourceData | ResourceIdentifier | null,
    I extends ResourceData[] | undefined = ResourceData[] | undefined,
    L extends LinksCollection | undefined = LinksCollection | undefined,
    M extends Meta | undefined = Meta | undefined,
  > = ItemResponse<D, I, L, M> | CollectionResponse<Exclude<D, null>[], I, L, M>;

  // about: a link that leads to further details about this particular occurrence of the problem.
  export interface ErrorLinksCollection {
    about: Link;
  }

  // pointer: a JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute].
  // parameter: a string indicating which URI query parameter caused the error.
  export interface ErrorSource {
    pointer?: string;
    parameter?: string;
  }

  // id: a unique identifier for this particular occurrence of the problem.
  // links: a links object containing the following members:
  //   about: a link that leads to further details about this particular occurrence of the problem.
  // status: the HTTP status code applicable to this problem, expressed as a string value.
  // code: an application-specific error code, expressed as a string value.
  // title: a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
  // detail: a human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.
  // source: an object containing references to the source of the error, optionally including any of the following members:
  //   pointer: a JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute].
  //   parameter: a string indicating which URI query parameter caused the error.
  // meta: a meta object containing non-standard meta-information about the error.
  export interface ErrorDetails {
    id?: string;
    links?: ErrorLinksCollection;
    status?: string;
    code?: string;
    title?: string;
    detail?: string;
    source?: ErrorSource;
    meta?: Meta;
  }

  // errors: an array of error objects
  export interface ErrorResponse<
    L extends LinksCollection | undefined = LinksCollection | undefined,
    M extends Meta | undefined = Meta | undefined,
  > extends CommonResponseProperties<L, M> {
    errors: ErrorDetails[];
  }

  // data: the document’s “primary data”
  // errors: an array of error objects
  // meta: a meta object that contains non-standard meta-information.
  // jsonapi: an object describing the server’s implementation
  // links: a links object related to the primary data.
  // included: an array of resource objects that are related to the primary data and/or each other (“included resources”).
  export type Response<
    D extends ResourceData | ResourceIdentifier | null = ResourceData | ResourceIdentifier | null,
    I extends ResourceData[] | undefined = ResourceData[] | undefined,
    L extends LinksCollection | undefined = LinksCollection | undefined,
    M extends Meta | undefined = Meta | undefined,
  > = SuccessResponse<D, I, L, M> | ErrorResponse<L, M>;
}

export default JsonApi;

// declare const foo: JsonApi.LinksCollection<"first" | "last">;

// declare const bar: { a?: string; };

// foo.
// bar.
