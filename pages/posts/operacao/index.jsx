import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import styleModal from '../../../sass/componentes/modal.module.scss';
import styleLista from '../../../sass/paginas/lista.module.scss';
import prisma from '../../../lib/prisma'

export const getServerSideProps = async () => {
    const operacoes = await prisma.operacao.findMany()
    const relLicenca = await await prisma
    .$queryRaw`SELECT id,descricao FROM licenca`

    return { props: {operacoes, relLicenca}}
}

export default function Operacao(props){
    const [lista, setLista] = useState([])
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
    }

    const submitData = async (form) => {

        form.preventDefault()
        
        const urlEnvio = isEdicao ?
            `/api/operacoes/${itemEdicao.id}`
            : `/api/operacoes/gravar-operacao`

        let corpoReq = {
            descricao: form.target.descricao.value,
            abreviacao: form.target.abreviacao.value,
            data: new Date(form.target.data.value),
            licenca: Number(form.target.licenca.value)
        }, metodoChamada = isEdicao ? 'Put' : 'Post'

        if(isEdicao){
            corpoReq = {...corpoReq, id: ''}
            corpoReq.id = itemEdicao.id
        }

        const retorno = await fetch(urlEnvio,
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
            <h1 className={styleLista.listaNavTitulo}>Listagem de Operacoes Ativas</h1>
            <a className={styleLista.listaNavInserir} href="#Popup" >&#10010;</a>    
        </section>

        <section className={styleLista.listaConteudo}>
            {
                props.operacoes.length > 0 ?        
                props.operacoes.map( (item) => {
                    return <>
                        <div className={styleLista.listaConteudoItem} key={item.id}>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label htmlFor="cmpNome">Descricao:</label>
                                <span>{item.descricao}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label htmlFor="cmpNome">Abreviacao:</label>
                                <span>{item.abreviacao}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label htmlFor="cmpNome">Data:</label>
                                <span>{new Date(item.data).toLocaleDateString()}</span>
                            </div>
                            <div className={styleLista.listaConteudoItemGrupo}>
                                <label htmlFor="cmpNome">Licenca:</label>
                                <span>{item.licenca}</span>
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
                                            alterarOperacao(item)
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
                        <form id="operacaoForm" onSubmit={ submitData }>

                            <div className={styleModal.popupFormGroup}>
                                <label>Descricao</label>
                                <input name="descricao" type="text" required/>
                            </div>

                            <div className={styleModal.popupFormGroup}>
                                <label>Abreviacao</label>
                                <input name="abreviacao" type="text" required/>
                            </div>

                            <div className={styleModal.popupFormGroup}>
                                <label>Data</label>
                                <input name="data" type="date" required />
                            </div>

                            <div className={styleModal.popupFormGroup}>
                                <label>Licenca</label>
                                <select name='licenca'>
                                    {
                                        props.relLicenca.length > 0 ? 
                                        props.relLicenca.map(
                                            (item) => <>
                                                <option value={item.id}>{item.descricao}</option>
                                            </>
                                        ):
                                        <option value={0}>Não existem licencas para serem carregadas</option>
                                    }
                                </select>
                            </div>

                        </form>                        
                        <button className={styleModal.popupBotao} type="submit" form="operacaoForm">
                            Enviar
                        </button>
                        <a href="#" className={styleModal.popupClose}>&times;</a>                       
                    </div>
                </div>
            </div>
    </>
}