export interface DrupalMetatag {
  tag: string;
  attributes: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    content: any;
    property: string;
    schema_metatag: boolean;
    name?: string;
    rel?: string;
  };
}
