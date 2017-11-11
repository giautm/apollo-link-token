import {
  ApolloLink,
  Operation,
  NextLink,
  FetchResult,
  Observable,
} from 'apollo-link';

async function noopTokenAsync(): Promise<string> {
  return null;
}

export type TokenLinkOptions = {
  getValidTokenAsync: () => Promise<string>;
}

export class TokenLink extends ApolloLink {
  private getValidTokenAsync: () => Promise<string>;

  constructor({
    getValidTokenAsync,
  }: TokenLinkOptions = {
    getValidTokenAsync: noopTokenAsync,
  }) {
    super();
    this.getValidTokenAsync = getValidTokenAsync;
  }

  public request(
    operation: Operation,
    forward: NextLink,
  ): Observable<FetchResult> {
    return new Observable<FetchResult>((observer) => {
      const promise = this.getValidTokenAsync().then((token: string) => {
        operation.setContext(({ headers, ...context }) => ({
          ...context,
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null,
          },
        }));
        return forward(operation);
      }).then((nextLinkObservable: Observable<FetchResult>) =>
        nextLinkObservable.subscribe(observer));

      return () => {
        promise.then((subscription) => {
          if (subscription) {
            subscription.unsubscribe();
          }
        });
      };
    });
  }
}
