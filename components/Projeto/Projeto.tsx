import React from 'react'
import Link from 'next/link'

interface ProjetoProps{
    nome: string
    url: string
}

export default function Projeto({nome,url}: ProjetoProps) {

    

  return (
    <article className='bg-yellow-500 p-2 m-2'>
      <h1 className='text-2x1'>{nome}</h1>
      <p>Explore o projeto {nome} no seguinte &nbsp;
        <Link href= {url} className="underline">
          link</Link>
      </p>
    </article>
  )
}
