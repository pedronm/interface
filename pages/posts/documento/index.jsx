import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import prisma from '../../../lib/prisma'
import styleModal from '../../../sass/componentes/modal.module.scss'
import styleLista from '../../../sass/paginas/lista.module.scss'
import Base64Helper from '../../../util/api/helper'

export const getServerSideProps = async () => {
    const totalDocumentos = await prisma.documento.findMany()
    return { props: { totalDocumentos } }
}

export default function Documento(props){
    const [lista, setLista] = useState([])
    const [nome, setNome] = useState([''])
    const [carregando, setCarregando] = useState(false)
    const [documento, setDocumentoBrray] = useState([''])
           
    const submitData = async (form) => {

        const UPLOAD_FILE_SIZE_LIMIT = 5 * 1024 * 1024;
        form.preventDefault();
    
        const exibB = document.getElementById("exibitDois"),
        exibA = document.getElementById("exibit"),
        exibC = document.getElementById("exibitTres"),
    
        exibD = document.getElementById("exibitInterno"),
        exibE = document.getElementById("exibitInternoDois"),
        exibF = document.getElementById("exibitInternoTres")
    
        exibA.innerHTML = form.target.nome.value
        exibB.innerHTML = form.target.documento.value

        var file = form.target.documento.files[0];   
        var results = document.getElementById('results'),
            resultadoBaixado = document.getElementById('resultsBaixado'),
            iframe = document.getElementById('frameExibirArquivo');
        var pathBaixado = '',
        pathBaixadoB = ''
        results.innerHTML = ''
       
        const selectedFile = form.target.documento.files[0];

        
        const bytetray = selectedFile

        await fetch(
            '/api/documento/gravar-documento',
            {   
                method: "POST",
                body:JSON.stringify({
                    nome : form.target.nome.value,
                    url_documento_ocean: selectedFile.name,
                    arquivo: documento
                })
            }
        ).then(
            (retorno) => {
                results.innerHTML = retorno
                Base64Helper(retorno.arquivo)
            }
        ).catch( (erro) => {
            results.innerHTML = erro
        })

        window.history.back();
        
    }   

    const getBase64 = async (file) => {
        var reader = new FileReader();
        reader.readAsDataURL(file)
        return reader
    }

    function readFile(event) {
        var textarea = document.querySelector('textarea');
        textarea.textContent = event.target.result;
        setDocumentoBrray(event.target.result)
        console.log(event.target.result);
    }

    function changeFile(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.addEventListener('load', readFile);
        reader.readAsDataURL(file);
    }
    const baixaArquivoDoPrisma = async (itemArquivo) => {
        if(window && window !== undefined){            
            setCarregando(true)
            await Base64Helper(itemArquivo, window)
            .then(
                (e) => {                    
                    window.open(e, "_blank","width=1000,height=500,scrollbars=1,resizable=no," +
                "toolbar=no,directories=no,location=no,menubar=no,status=no,left=0,top=0")
                    setCarregando(false)
                }
            )
            .catch(
                (e) => {
                    setCarregando(false)
                }
            )
        }
    }


    return <>
        
        <section className={styleLista.listaNav}>
            <Link className={styleLista.listaNavLink} href={'/'}>&#8592;</Link>
            <h1 className={styleLista.listaNavTitulo}>Listagem de Documentos</h1>
            <a className={styleLista.listaNavInserir} href="#Popup" >&#10010;</a>    
        </section>

        <section className={styleLista.listaConteudo}>
            {
                props.totalDocumentos.length > 0 ?        
                props.totalDocumentos.map( (item) => {
                    return <>
                        <div className={styleLista.listaConteudoItem} key={item.id} onClick={ (e) =>{
                            alert(`item selecionado ${item.id}`)
                        }}>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label htmlFor="cmpNome">Nome:</label>
                                <span id="cmpNome"> {item.nome}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label htmlFor="cmpNome">Arquivo:</label>
                                <span>Nome do Arquivo: {item.url_documento_ocean}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <span className={styleLista.listaConteudoItemDownload} onClick={ () =>  { baixaArquivoDoPrisma(item.arquivo) }}>
                                    <img src="/img/ICODownload.png" />
                                </span>
                            </div>
                            {/* <iframe src={dados.url_documento_ocean}></iframe> */}
                        </div>
                    </>
                })
                
                :<div className={styleLista.listaVazia}>Não há registros para serem exibidos</div>
            }   
        </section>
        <section className={styleLista.rodape}>
            <pre> Versão 1.0 </pre>
            <a href="https://www.flaticon.com/free-icons/legal" title="legal icons">Legal icons created by Eucalyp - Flaticon</a>
        </section>
        <div className={carregando ? styleModal.loading : styleModal.no_loading}>
            <p>CARREGANDO</p>
        </div>
        <div className={styleModal.popup} id="Popup">
            <div className={styleModal.popup__content}>
                <div className={styleModal.popup__left}>
                    <img src="img/nat-8.jpg" className={styleModal.popup__img} alt="Tour photo" />
                    <img src="img/nat-9.jpg" className={styleModal.popup__img} alt="Tour photo" />
                </div>
                <div className={styleModal.popup__right}>
                    <form id="funcionaForm" onSubmit={ submitData }>
                        <label htmlFor="cmpNome">Nome</label>
                        <input id="cmpNome" type="text" name="nome" required/>

                        <label>Documento</label>
                        <input type="file" name="documento" onChange={changeFile} required/>

                        <label>Documento Convertido pra base 64</label>
                        <textarea></textarea>
                        
                    </form>

                    <div>
                        <pre id="exibit"></pre>
                        <pre id="exibitDois"></pre>
                        <pre id="exibitTres"></pre>
                    </div>
                    <br />
                    <div>
                        <pre id="exibitInterno"></pre>
                        <pre id="exibitInternoDois"></pre>
                        <pre id="exibitInternoTres"></pre>
                    </div>
                    <div id="results"></div>
                    <br/>
                    <div id="resultsBaixado"></div>
                    <iframe id="frameExibirArquivo"></iframe>
                    <button type="submit" form="funcionaForm">
                        Submit from outside form
                    </button>
                    <a href="#SectionTours" className={styleModal.popup__close}>&times;</a>                       
                </div>
            </div>
        </div>
    </>
}