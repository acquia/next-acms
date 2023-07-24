export interface DrupalMetatag {
  tag: string;
  attributes: {
    content: any;
    property: string;
    name?: string;
    rel?: string;
  };
}
