import Link from 'next/link'
import { useState, useEffect } from 'react'
import styleModal from '../../../sass/componentes/modal.module.scss';
import prisma from '../../../lib/prisma'

export const getServerSideProps = async () => {
    const operacoes = await prisma.operacao.findMany()
    const relLicenca = await await prisma
    .$queryRaw`SELECT id,descricao FROM licenca`

    return { props: {operacoes, relLicenca}}
}

export default function Operacao(props){
    const [lista, setLista] = useState([])
    const [descricao, setNome] = useState([''])
    
    const submitData = async (form) => {

    }   

    return <>

        <Link href={'/'}>Voltar para a home</Link>
        <a href="#Popup" className="btn btn--white">Inserir Registro Novo</a>    
        <br />
        <br />
        {
            props.operacoes.length > 0 ?        
            props.operacoes.map( (item) => {
                return <>
                    <div key={dados.id}>
                        <span>{dados.descricao}</span>
                        <span>{dados.abreviacao}</span>
                        <span>{dados.data}</span>
                        <span>{dados.licenca}</span>
                    </div>
                </>
            })
            
            :<div className="listaVazia">Não há registros para serem exibidos</div>
        }  
        <div className={styleModal.popup} id="Popup">
                <div className={styleModal.popup__content}>
                    <div className={styleModal.popup__left}>
                        <img src="img/nat-8.jpg" className={styleModal.popup__img} alt="Tour photo" />
                        <img src="img/nat-9.jpg" className={styleModal.popup__img} alt="Tour photo" />
                    </div>
                    <div className={styleModal.popup__right}>
                        <form id="funcionaForm" onSubmit={ submitData }>
                           
                            <label>Descricao</label>
                            <input type="text" />

                            <label>Abreviacao</label>
                            <input type="text" />

                            <label>Data</label>
                            <input type="date" />

                            <label>Licenca</label>
                            <select>
                                {
                                    props.relLicenca.length > 0 ? 
                                    props.relLicenca.map(
                                        (item) => <>
                                            <option value={item.id}>{item.descricao}</option>
                                        </>
                                    ):
                                    <option>Não existem licencas para serem carregadas</option>
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