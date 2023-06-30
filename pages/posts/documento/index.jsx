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

        const retorno = await fetch(
            '/api/documento/gravar-documento',
            {   
                method: "POST",
                body:JSON.stringify({
                    nome : form.target.nome.value,
                    url_documento_ocean: selectedFile.name,
                    arquivo: documento
                })
            }
        )

        if(retorno.status === "200"){
            alert('Gravado com Sucesso!')
            window.history.back();
        }else{
            alert('Erro ao Gravar!')
        }
        
    }   

    function readFile(event) {
        setDocumentoBrray(event.target.result)
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
                        <div className={styleLista.listaConteudoItem} key={item.id} >
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label htmlFor="cmpNome">Nome:</label>
                                <span id="cmpNome"> {item.nome}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label htmlFor="cmpNome">Arquivo:</label>
                                <span>Nome do Arquivo: {item.url_documento_ocean}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo} onClick={ () =>  { baixaArquivoDoPrisma(item.arquivo) }}>
                                <img className={styleLista.listaConteudoItemDownload} src="/img/ICODownload.png" />
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
            <div className={styleModal.popupContent}>
                
                <div className={styleModal.popupCenter}>
                    <form id="documentoForm" onSubmit={ submitData }>
                        
                        <div className={styleModal.popupFormGroup}>
                            <label htmlFor="cmpNome">Nome</label>
                            <input id="cmpNome" type="text" name="nome" required/>
                        </div>

                        
                        <div className={styleModal.popupFormGroup}>
                            <label>Documento</label>
                            <input type="file" name="documento" onChange={changeFile} required/>
                        </div>

                    </form>                        
                    <button className={styleModal.popupBotao} type="submit" form="documentoForm">
                        Enviar
                    </button>
                    <a href="#" className={styleModal.popupClose}>&times;</a>                       
                </div>
            </div>
        </div>
        
    </>
}