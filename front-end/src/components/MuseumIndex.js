import React, { useEffect, useState } from 'react'
import axios from 'axios'
import MuseumCard from './MuseumCard'

const MuseumsIndex = () => {

  const [museums, setMuseums] = useState([])

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/museums')
      setMuseums(data)
    }
    getData()
  }, [])

  // console.log('museums ->', museums.sort())
  return (
    <section id='showAllSection' className='section'>
      <div id='showAllHead'>
        <h1 id='showAllTitle'>Museums</h1>
        <h2>Check out these fascinating natural history collections across England</h2>
      </div>
      <div className='container'>
        <div className='columns is-multiline'>
          {museums.map(museum => {
            return (
              <MuseumCard key={museum._id} {...museum} />
            )
          })}
        </div>
      </div>
    </section>
  )

}
export default MuseumsIndex