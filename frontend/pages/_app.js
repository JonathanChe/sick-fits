import App, { Container } from 'next/app';
import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';


class MyApp extends App {

  // to expose page numbers
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    // if component that we're trying to render has getInitialProps
    if (Component.getInitialProps) {
      // then surface those via page props
      pageProps = await Component.getInitialProps(ctx)
    }
    // this exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }

  render() {
    const { Component, apollo, pageProps } = this.props;

    return  (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
          <Component {...pageProps}/>
          </Page>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withData(MyApp);