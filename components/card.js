import cardStyles from '../sass/componentes/card.module.scss';
import Link from 'next/link';

export default function Card(props){
    return <>
        <Link href={props.link} className={cardStyles.cardLink}>
            <div className={cardStyles.card}>
                <div className={cardStyles.cardTitulo}>
                    {props.titulo ? props.titulo : 'Titulo Default'}
                </div>
                <div className={cardStyles.cardCorpo}>
                    <div className={cardStyles.cardImagem}>
                        <img src={props.imagemFundo} />
                    </div>
                </div>            
                
            </div>
        </Link>
    </>
}