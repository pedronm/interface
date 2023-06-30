import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import styleModal from '../../../sass/componentes/modal.module.scss';
import prisma from '../../../lib/prisma'

export const getServerSideProps = async () => {
    const totalLicenca = await prisma.licenca.findMany()
    const totalDocs = await prisma.$queryRaw`SELECT id,nome FROM documento`
    return { props: { totalLicenca, totalDocs } }
}

export default function Documento(props){
    const [lista, setLista] = useState([])
    const [listaDoc, setlistaDoc] = useState([])
    const [descricao, setNome] = useState([''])

    const submitData = async (form) => {
        form.preventDefault()

        await(
            '/api/licenca/gravar-licenca',
            {
                method: "POST",
                body: JSON.stringify({
                    nome: form.target.nome.value,
                    vencimento: form.target.vencimento.value,
                    inicio: form.target.inicio.value,
                    tipo: form.target.tipo.value,
                    documento: form.target.documento.value
                })
            }
        ).then(
            (ret) => {

            }
        ).catch(
            (err) => {

            }
        )
    }   

    return <>

        <Link href={'/'}>Voltar para a home</Link>
        <a href="#Popup" className="btn btn--white">Inserir Registro Novo</a>    
        <textarea id="preencherComDados"></textarea>
        <br />
        <br />
        {
            lista.length > 0 ?        
            lista.map( (item) => {
                return <>
                    <div key={dados.id}>
                        <span>{dados.descricao}</span>
                        <span>{dados.vencimento}</span>
                        <span>{dados.inicio}</span>
                        <span>{dados.tipo}</span>
                        <span>{dados.documentos}</span>
                    </div>
                </>
            })
            
            :<div className="listaVazia">Não há registros para serem exibidos</div>
        }  
        <div className={styleModal.popup} id="Popup" >
                <div className={styleModal.popup__content}>
                    <div className={styleModal.popup__left}>
                        <img src="img/nat-8.jpg" className={styleModal.popup__img} alt="Tour photo" />
                        <img src="img/nat-9.jpg" className={styleModal.popup__img} alt="Tour photo" />
                    </div>
                    <div className={styleModal.popup__right} >
                        <form id="funcionaForm" onSubmit={ submitData }>
                           
                            <label>Descricao</label>
                            <input type="text" />

                            <label>Vencimento</label>
                            <input type="text" />

                            <label>Inicio</label>
                            <input type="text" />

                            <label>Tipo</label>
                            <input type="text" />

                            <label>Documento</label>
                            <select>
                                {
                                    props.totalDocs.length > 0 ? 
                                    props.totalDocs.map(
                                        (item) => <>
                                            <option value={item.id}>{item.nome}</option>
                                        </>
                                    ):
                                    <option>Não carregou :(</option>
                                }
                            </select>

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