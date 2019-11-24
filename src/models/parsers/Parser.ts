export default interface Parser<S, T> {
  parse(value: S): T;
}
