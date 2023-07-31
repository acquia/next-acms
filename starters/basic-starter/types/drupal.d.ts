export interface DrupalMetatag {
  tag: string;
  attributes: {
    content: any;
    property: string;
    schema_metatag: boolean;
    name?: string;
    rel?: string;
  };
}
