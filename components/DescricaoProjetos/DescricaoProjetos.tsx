import Link from 'next/link'
import Projeto from '@/components/Projeto/Projeto'
import React from 'react'

export default function DescricaoProjetos() {

  
  return (
    <div>
        <h2>Projetos</h2>
        <p>Já fiz muitas projetos em html, Javascript e CSS</p>
        <p>Visite o meu &nbsp;
        <Link className='font-bold underline' href="https://github.com/diogo-oliveira-a22405887/diogo-oliveira-a22405887.github.io"  target='_blank'>Website</Link> 
        </p>

        <Projeto
            nome="loja"
            url="https://cuddly-giggle-r4xrqg5vqr793prgj-5502.app.github.dev/lab7/index.html"
        />
    </div>
  )
}
