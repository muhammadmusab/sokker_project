export interface ComponentAttrs {
    className?: string;
    children?: React.ReactNode;
    id?: string;
    asChild?: boolean;
  }
  

  export interface IOption {
    label: React.ReactNode;
    value: string | boolean;
    id?: string;
  }
  