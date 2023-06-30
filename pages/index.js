import Head from 'next/head';
import homeStyles from '../sass/Home.module.scss';
import Card from '../components/card'

export default function Home({ allPostsData }) {
  return (
    <>
      <Head>
        <title>GEBEM</title>
      </Head>
      <section className={homeStyles.cabecalho}>
        <span className={homeStyles.cabecalhoTitulo}>Gebem</span>
      </section>
      <section className={homeStyles.conteudo}>
        <Card imagemFundo="/img/ICODocumentoBig.png" titulo="Documento" cor="" link={`/posts/documento`}/>
        <Card imagemFundo="/img/ICOLicensa.png" titulo="Operacoes" cor="" link={`/posts/operacao`}/>
        <Card imagemFundo="/img/ICOOperacoesBig.png" titulo="Licenca" cor="" link={`/posts/licenca`}/>
      </section>
      <section className={homeStyles.rodape}>
        <pre> Versão 1.0 </pre>
        <a href="https://www.flaticon.com/free-icons/legal" title="legal icons">Legal icons created by Eucalyp - Flaticon</a>
      </section>
    </>
  );
}
