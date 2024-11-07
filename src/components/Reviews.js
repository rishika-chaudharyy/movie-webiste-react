import React, { useState, useEffect } from 'react';
import ReactStars from 'react-stars';
import { ReviewsRef, db } from '../firebase/firebase';
import { addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { TailSpin } from 'react-loader-spinner';
import swal from 'sweetalert';
import { ThreeDots } from 'react-loader-spinner';

const Reviews = ({ id, prevRating, userRated }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [form, setForm] = useState("");
  const [data, setData] = useState([]);

  const sendReview = async () => {
    setLoading(true);
    try {
      await addDoc(ReviewsRef, {
        movieid: id,
        name: "Rishika",
        rating: rating,
        thought: form,
        timestamp: new Date().getTime()
      });
      const ref = doc(db, "movies", id)
      await updateDoc(ref, {
        rating: prevRating + rating,
        rated: userRated + 1
      })
      setRating(0);
      setForm("");
      swal({
        title: "Review Sent",
        icon: "success",
        buttons: false,
        timer: 3000 // Use 'timer' instead of 'time'
      });
    } catch (error) {
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000 // Use 'timer' instead of 'time'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      setReviewsLoading(true);
      setData([]);
      let quer = query(ReviewsRef, where('movieid', '==', id))
      const querySnapshot = await getDocs(quer);

      querySnapshot.forEach((doc) => {
        setData((prev) => [...prev, doc.data()])
      })

      setReviewsLoading(false);

    }
    getData();
  }, [])
  return (
    <div className="mt-2 py-1 w-full border-t-2 border-gray-700">
      <ReactStars
        size={35}
        half={true}
        onChange={(rate) => setRating(rate)}
      />
      <input
        value={form}
        onChange={(e) => setForm(e.target.value)}
        placeholder="Share your thoughts"
        className="w-full p-2 outline-none header"
      />
      <button onClick={sendReview} className="bg-green-400 w-full p-1 flex justify-center">
        {loading ? <TailSpin height={20} color="white" /> : 'Share'}
      </button>
      {
        reviewsLoading ? <div className="mt-8 flex justify-center"><ThreeDots height={15} color="white" /></div> :
          <div className='mt-4'>
            {data.map((e, i) => {
              return (
                <div className=' p-2 w-full border-b header bg-opacity-50 border-gray-600 mt-2' key={i}>
                  <div className='flex items-center'>
                    <p className='text-blue-500'>{e.name}</p>
                    <p className='ml-3 text-xs'>({new Date(e.timestamp).toLocaleString()})</p>
                  </div>
                  <ReactStars
                    size={15}
                    half={true}
                    value={e.rating}
                    edit={false}
                  />

                  <p>{e.thought}</p>
                </div>
              )
            })}
          </div>
      }
    </div >
  );
};

export default Reviews;
