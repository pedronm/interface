import { useEffect, useState } from "react";
import styleModal from "../../sass/componentes/modal.module.scss";
import Link from 'next/link'
import prisma from '../../lib/prisma'
import {ItemLista, FormularioItem} from "../../components/item-lista";


export const getServerSideProps = async ({ req, res }) => {
    const urlQuebrada = req.url.split('/'),
         tipoLista = urlQuebrada[urlQuebrada.length -1];   
    const lista = JSON.parse(JSON.stringify(await prisma[tipoLista].findMany() ) );

    return {
      props: { lista, tipoLista },
    };
};

export default function Lista(props){    
    
    const [error, setError] = useState(['Error'])

    useEffect((e) => {
        console.log(e)
    }, [error]) 

    const getProperBody = async (tipo, form) => {
        if(tipo === 'documento')
            return JSON.stringify({
                nome: form.target.nome.value,
                arquivo: form.target.documento.value
            })
        else if (tipo === 'operacoes')
            return {
                descricao: form.target.descricao,
                abreviacao: form.target.abreviacao,
                data: form.target.descricao.data,
                licenca: form.target.descricao.licenca
            }
        else if (tipo === 'licenca')
            return {
                descricao: form.target.descricao,
                vencimento: form.target.vencimento,
                inicio: form.target.inicio,
                tipo: form.target.tipo 
            }
    }

    const submitData = async (e) => {

        let mostraDoido = document.getElementById('exibit'),
            mostraDoidoDois = document.getElementById('exibitDois'),
            mostraDoidoTres = document.getElementById('exibitTres');

        let exibitInterno = document.getElementById('exibitInterno'),
            exibitInternoDois = document.getElementById('exibitInternoDois'),
            exibitInternoTres = document.getElementById('exibitInternoTres')

        e.preventDefault()
        

        const tipoChamada = props.tipoLista,
            formData = await getProperBody(props.tipoLista, e )

        mostraDoido.innerHTML = formData
        mostraDoidoDois.innerText = `O tipo da lista é ${props.tipoLista} 
         e Esse é o corpo do formulário ${formData.nome}, ${formData.arquivo}`
        mostraDoidoTres.innerHTML = formData + formData.nome

        try {
            await fetch(`/api/${tipoChamada}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: formData,
            }).then(
                (e => {
                    exibitInterno.innerHTML = 'Entrou no then'  
                    exibitInternoTres.innerHTML = `  Essa é o corpo da mensagem ${e.status} ${e.statusText} ${e.body} `
                    console.log('resposta da chamada na api',e)
                })
            ).catch(
                (erro) =>{
                    exibitInterno.innerHTML = 'Entrou no erro' 
                    exibitInternoDois.innerHTML = `Essa é a mensagem de erro ${erro.msg}`
                    exibitInternoTres.innerHTML = erro
                    console.log('Erro ao chamar a api',erro)
                }
            );
        } catch (erro) {
            mostraDoido.innerHTML = 'Entrou no erro da chamada de api '
            mostraDoidoDois.innerHTML = `Essa é a mensagem de erro ${erro.msg} `
            mostraDoidoTres.innerHTML = erro
            console.error(erro);
        }
    }
    
    return<>
             
           
    </>
    
        
}