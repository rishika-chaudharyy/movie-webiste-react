import React from 'react'
import { useState, useEffect } from 'react'
import { TailSpin } from 'react-loader-spinner'
import ReactStars from 'react-stars'
import { getDocs } from 'firebase/firestore'
import { movieRef } from '../firebase/firebase'
import { Link } from 'react-router-dom'



const Cards = () => {

  const [data, setData] = useState([])

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getData() {
      setLoading(true);

      const _data = await getDocs(movieRef);
      _data.forEach((doc) => {
        setData((prv) => [...prv, { ...(doc.data()), id: doc.id }])
      })
      setLoading(false);
    }
    getData();
  }, [])
  return (
    <div className='flex flex-wrap justify-between px-3 mt-2'>
      {loading ? <div className="w-full flex justify-center items-center min-h-screen"> <TailSpin height={40} color="white" /></div> :

        data.map((e, i) => {
          return (


            <Link to={`/detail/${e.id}`}> <div key={i} className="card shadow-lg p-2 rounded-lg hover:-translate-y-2 transition-all duration-500 cursor-pointer mt-3 text-sm font-bold">
              <img className='h-60 md:h-72' src={e.image} />
              <h1>Name : {e.title}</h1>
              <h1>Rating : <ReactStars size={20} half={true} value={e.rating / e.rated} edit={false} /></h1>
              <h1>Year : {e.year}</h1>

            </div></Link>


          )
        })
      }

    </div >
  )
}

export default Cards
