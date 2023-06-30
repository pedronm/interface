import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import styleModal from '../../../sass/componentes/modal.module.scss';
import styleLista from '../../../sass/paginas/lista.module.scss';
import prisma from '../../../lib/prisma'

export const getServerSideProps = async () => {
    const totalLicenca = await prisma.licenca.findMany()
    const totalDocs = await prisma.$queryRaw`SELECT id,nome FROM documento`
    return { props: { totalLicenca, totalDocs } }
}

export default function Documento(props){
    const [lista, setLista] = useState([])
    const [listaDoc, setlistaDoc] = useState([])
    const [itemEdicao, setItemEdicao]=useState({})
    const [isEdicao, setIsEdicao] = useState(false)

    async function alterarOperacao(item){

        setIsEdicao(true)
        const formulario = document.getElementById('operacaoForm')
        //setar o elemento nos campos
        formulario.descricao.value = item.descricao
        formulario.abreviacao.value = item.abreviacao
        formulario.data.value = new Date(item.data)
        formulario.licenca.value = item.licenca

        setItemEdicao(item)
        window.location = '#Popup'

    }

    async function excluir(id){
        const exclusao = await fetch(
            `/api/operacoes/${id}`, {
                method: 'Delete'
            }
        )

        if(exclusao.status === '200'){
            alert('Exclusao bem sucedida')
        }else{
            alert('Erro ao excluir')
        }

        location.reload()
    }

    const submitData = async (form) => {
        form.preventDefault()

        const urlEnvio = isEdicao ?
            `/api/licenca/${itemEdicao.id}`
            : `/api/licenca/gravar-licenca`

        let corpoReq = {
            descricao: form.target.descricao.value,
            vencimento: form.target.vencimento.value,
            inicio: form.target.inicio.value,
            tipo: form.target.tipo.value,
            documento_licenca: Number(form.target.documentoLicenca.value)
        }, metodoChamada = isEdicao ? 'Put' : 'Post'
        
        if(isEdicao){
            corpoReq = {...corpoReq, id: ''}
            corpoReq.id = itemEdicao.id
        }

        const retorno = await fetch( 
            urlEnvio,
            {
                method: metodoChamada,
                body: JSON.stringify(corpoReq)
            }
        )

        if(retorno.status == 200)
            alert('Gravado com Sucesso!')
        else
            alert('Erro ao Gravar')

        window.history.back();
    }   

    return <>

        <section className={styleLista.listaNav}>   
            <Link className={styleLista.listaNavLink} href={'/'}>&#8592;</Link>
            <h1 className={styleLista.listaNavTitulo}>Listagem de Licencas Disponíveis</h1>
            <a className={styleLista.listaNavInserir} href="#Popup" >&#10010;</a>    
        </section>

        <section className={styleLista.listaConteudo}>
            {
                props.totalLicenca.length > 0 ?        
                props.totalLicenca.map( (item) => {
                    return <>
                        <div className={styleLista.listaConteudoItem} key={item.id}>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label >Descricao:</label>
                                <span>{item.descricao}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label >Vencimento:</label>
                                <span>{new Date(item.vencimento).toLocaleDateString()}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label >Inicio:</label>
                                <span>{new Date(item.inicio).toLocaleDateString()}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label >Tipo:</label>
                                <span>{item.tipo}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label >Documento:</label>
                                <span>{item.documentos}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label>Acoes</label>
                                <div className={styleLista.listaConteudoItemAcoes}>
                                    <img className={styleLista.listaConteudoItemIco} 
                                            src="/img/ICOLixeira.png" 
                                            alt="Excluir" 
                                            onClick={ () => {
                                                if(confirm('Confirma exclusao?')) {
                                                    excluir(item.id)
                                                }
                                            }}
                                        />
                                    <img className={styleLista.listaConteudoItemIco} 
                                        src="/img/ICOEditar.png" alt="Editar" 
                                        onClick={ () => {
                                            alterar(item)
                                        }}/>
                                </div>
                            
                            </div>
                        </div>
                    </>
                })
                
                :<div className="listaVazia">Não há registros para serem exibidos</div>
            }  
        </section>
        <section className={styleLista.rodape}>
            <pre> Versão 1.0 </pre>
            <a href="https://www.flaticon.com/free-icons/legal" title="legal icons">Legal icons created by Eucalyp - Flaticon</a>
        </section>

        <div className={styleModal.popup} id="Popup">
            <div className={styleModal.popupContent}>
                
                <div className={styleModal.popupCenter}>
                    <form id="licencaForm" onSubmit={ submitData }>
                        
                        <div className={styleModal.popupFormGroup}>
                            <label>Descricao</label>
                            <input name="descricao" type="text" required/>
                        </div>

                        <div className={styleModal.popupFormGroup}>
                            <label>Inicio</label>
                            <input name="inicio" type="date" required />
                        </div>

                        <div className={styleModal.popupFormGroup}>
                            <label>Vencimento</label>
                            <input name="vencimento" type="date" required/>
                        </div>

                        <div className={styleModal.popupFormGroup}>
                            <label>Tipo</label>
                            <input name="tipo" type="text" required />
                        </div>

                        <div className={styleModal.popupFormGroup}>
                            <label>Documento</label>
                            <select name='documentoLicenca'>
                                {
                                        
                                    props.totalDocs.length > 0 ? 
                                    props.totalDocs.map(
                                        (item) => <>
                                            <option value={item.id}>{item.nome}</option>
                                        </>
                                    ):
                                    <option value={0}>Não existem documentos para serem carregadas</option>
                                
                                }
                            </select>
                        </div>

                    </form>                        
                    <button className={styleModal.popupBotao} type="submit" form="licencaForm">
                        Enviar
                    </button>
                    <a href="#" className={styleModal.popupClose}>&times;</a>                       
                </div>
            </div>
        </div>
        
    </>
}