import PageWrapper from "./components/PageWrapper";
import Container from "./components/Container";
import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  return (
   <PageWrapper>
      <Container>
        <Header />
        <Main />
      </Container>
   </PageWrapper>
  );
}

export default App;