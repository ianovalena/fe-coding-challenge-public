/**
 * A page of data of type `T`.
 */
export interface Page<T> {
  more: boolean;
  content: T[];
}
