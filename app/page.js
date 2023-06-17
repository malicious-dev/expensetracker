'use client'
import React, { useState, useEffect } from 'react'
import { collection, addDoc, getDoc, querySnapshot, query, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

export default function Home() {

  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({ name: '', price: '' })
  const [total, setTotal] = useState(0)

  const addItem = async (e) => {
    e.preventDefault()
    if (newItem.name === '' || newItem.price === '')
      return
    // setItems([...items, newItem])
    // setNewItem({ name: '', price: 0 })
    await addDoc(collection(db, "items"), {
      name: newItem.name.trim(),
      price: newItem.price
    });
    setNewItem({ name: '', price: '' })
  }

  useEffect(() => {
    const q = query(collection(db, "items"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = []
      let total = 0
      querySnapshot.forEach((doc) => {
        items.push(doc.data())
        total += parseFloat(doc.data().price)
      });
      setItems(items)
      setTotal(total)
    }
    );
    return () => unsubscribe()


  }, [])



  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm ">
        <h1 className='text-4xl p-4 text-center'>Expense Tracker</h1>
        <div className='bg-slater-800 p-4 rounded-lg'>
          <form action="" className='grid grid-cols-6 items-center text-black'>
            <input
              value={ newItem.name }
              onChange={ e => setNewItem({ ...newItem, name: e.target.value }) }
              className='col-span-3 p-3 border' type="text" placeholder='Enter Item' />
            <input
              value={ newItem.price }
              onChange={ e => setNewItem({ ...newItem, price: e.target.value }) }
              className='col-span-2 p-3 border mx-3' type="text" placeholder='Enter $' />
            <button onClick={ addItem } className='text-white bg-slate-950 hover:bg-slater-900 p-3 text-xl' type='submit'>+</button>
          </form>
          <ul>
            { items.map((item, index) => (
              <li key={ index } className='my-4 w-full flex justify-between bg-slate-950'>
                <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize'>{ item.name }</span>
                  <span>{ item.price }</span>
                </div>
                <button className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'>
                  X
                </button>
              </li>
            )) }

          </ul>

          {
            items.length > 0 && (
              <div className='p-4 w-full flex justify-between bg-slate-950'>
                <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize'>Total</span>
                  <span>{ total }</span>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </main>
  )
}
