import React, { useEffect, useState } from 'react';
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa"
import { BsDownload } from "react-icons/bs"
import { FiShare2 } from "react-icons/fi"
import { SlHeart } from "react-icons/sl"
import { AiFillHeart } from "react-icons/ai"
import { BsArrowUpRight } from "react-icons/bs"
import Likes from './Likes';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "share-api-polyfill";

import { fetchRandomQuote } from './utils/quotes';
import { generateCanvas } from './utils/canvas';

function App() {
  const [quote, setQuote] = useState({ quotation: "", author: "", imageSize: { height: 3648, width: 5472 }, image: "", liked: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openLikes, setOpenLikes] = useState(false);
  const [likes, setLikes] = useState([]);
  const [quoteCanvas, setQuoteCanvas] = useState("");

  const handleFetchRandomQuote = async () => {
    setError("")
    setLoading(true)
    const { content: quotation, author, image, error } = await fetchRandomQuote();
    if (error) {
      setError(error);
      setLoading(false);
      return
    }
    setLoading(false);
    setQuote({ ...quote, quotation, author, image });
    const canvas = generateCanvas(quotation, author, quote.imageSize, image);
    setQuoteCanvas(canvas);
  }

  const fetchTodayQuote = async () => {
    setError("")
    setLoading(true)
    const { content: quotation, author, imageSize, image, error } = await fetchRandomQuote();
    if (error) {
      setError(error);
      setLoading(false);
      return
    }
    setLoading(false);
    setQuote({ ...quote, quotation, author, image });
    const canvas = generateCanvas(quotation, author, quote.imageSize, image);
    setQuoteCanvas(canvas);
    const timeStamp = Date.now() + 1000 * 60 * 60 * 24 // 60 mins * 24 = 24 hours
    localStorage.setItem("quoteOfTheDay", JSON.stringify({ quotation, author, timeStamp, image }))
  }

  const setTodayQuote = async () => {
    setError("");
    setLoading(false)
    // if there is quote inside localstorage
    if (JSON.parse(localStorage.getItem("quoteOfTheDay"))) {
      const { author, quotation, image, timeStamp } = JSON.parse(localStorage.getItem("quoteOfTheDay"));

      // if quote has expired
      if (Date.now() > timeStamp) {
        fetchTodayQuote();
        return
      }
      setQuote({ ...quote, quotation, author, image });
      const canvas = generateCanvas(quotation, author, quote.imageSize, image);
      setQuoteCanvas(canvas);
    } else {
      fetchTodayQuote();
    }
  }

  const download = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    let canvasLink = await quoteCanvas.toDataURL("image/jpeg")
    let link = document.createElement("a");
    link.href = canvasLink;
    link.setAttribute('download', "download")
    link.click();
  }

  const share = async () => {
    navigator.share({
      title: 'Random Quote Extension',
      text: `"${quote.quotation}" \n\n\t\t\t\t ${quote.author}`,
      url: ""
    })
      .then(_ => null)
      .catch(error => alert(error));
  }

  const closeLikes = () => {
    setOpenLikes(false)
  }

  const likeQuote = async () => {
    try {
      // check if userId already exists 
      let userId = localStorage.getItem("userId");
      const { quotation, author, image, imageSize } = quote;

      // generate userId
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem("userId", userId);
      }

      // check if quote already exist
      let sameQuote = likes.filter(quote => quote.quotation === quotation)

      if (sameQuote.length) {
        toast.info("Quote already liked by you!")
        return
      }
      // send request
      const data = {
        userId,
        likedQuote: {
          quotation,
          author,
          image,
          imageSize
        }
      }
      await fetch("/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      setLikes([...likes, { quotation, author, image, imageSize }])
      toast.success("Quote liked successfully")
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchLikes = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLikes([]);
      return;
    }
    let res = await fetch(`/likes/${userId}`)
    const { likes } = await res.json();
    setLikes(likes)
  }

  const setQuoteFromLike = (quotation, author, image) => {
    setQuote({ ...quote, quotation, author, image });
  }

  useEffect(() => {
    setTodayQuote()
    fetchLikes()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="font-monteserat flex justify-center items-center">
      <ToastContainer />
      <div>
        <h1 className='heading  text-center text-2xl mt-5  font-bold'>Quotomatic</h1>
        <h2 className='heading text-center text-lg mt-1 font-medium'>Generate Quotes With Style</h2>
        <div className='flex flex-col justify-center items-center'>
          <Likes likes={likes} open={openLikes} closeLikes={closeLikes} setQuoteFromLike={setQuoteFromLike} />
          {error ? <div className='h-80 w-96 m-5 flex flex-col justify-center items-center'>{error}</div> : <div>
            {loading ? <div className='h-80 w-96 m-5 flex flex-col justify-center items-center'>
              <p className="relative flex h-10 w-10 my-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-10 w-10 bg-sky-100"></span>
              </p>
            </div> :
              <div className='p-5 m-5 h-80 w-96 text-white rounded-md relative border border-red-900' style={{ backgroundImage: `url(${quote.image})`, backgroundSize: "100% 100%", backgroundRepeat: "no-repeat" }}>
                <p className='text-xl my-5 font-semibold drop-shadow-slightly-larger'>
                  <FaQuoteLeft />
                  {quote.quotation}
                </p>
                <p className='text-sm text-right font-semibold drop-shadow-slightly-larger'><span>- </span>{quote.author}</p>
                <p className='flex justify-start absolute bottom-3 w-full left-0'>
                  <button className=' px-3 py-2 w-14  shadow ml-3 bg-white hover:text-gray-400  text-black font-bold flex justify-center' onClick={download}><BsDownload /></button>
                  <button onClick={share} className=' px-3 py-2 w-14 shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center'><FiShare2 /></button>
                  {likes.filter(likedQuote => likedQuote.quotation === quote.quotation).length ?
                    <button disabled className=' px-3 py-2 w-14 shadow ml-3 bg-white text-red-400 cursor-not-allowed font-bold flex justify-center'><AiFillHeart /></button>
                    :
                    <button className=' px-3 py-2 w-14 shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center' onClick={likeQuote}><SlHeart /></button>
                  }
                </p>
              </div>}
          </div>
          }
        </div>
        <div className='flex justify-center items-center'>
          <button className=' px-3 py-2 w-24 rounded-tl-3xl rounded-br-3xl shadow border bg-white hover:text-gray-400    text-black  flex justify-center' onClick={setTodayQuote}>Today</button>
          <button className=' px-3 py-2 w-24 rounded-tl-3xl rounded-br-3xl  shadow ml-5 border bg-white hover:text-gray-400   text-black flex justify-center' onClick={handleFetchRandomQuote}>Random</button>
        </div>
        <div className='flex flex-col justify-center items-center my-5'>
          <div className='text-slate-400 my-5 w-96'>
            <p className='quote'><i>"{quote.quotation}"</i></p>
            <p className='text-right'>{quote.author}</p>
          </div>
          <div className='my-5'>
            <p className='text-slate-400'>
              Images are from unsplash {"  "}
              <a href={`${quote.image}`} className='text-red-400' target="_blank" rel="noreferrer">See Image Here</a>
            </p>
          </div>
          <button onClick={() => { setOpenLikes(prev => !prev); }} className='px-3 py-2 w-fit  shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center items-center'>
            <span className=''>Liked Quotes</span><BsArrowUpRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;