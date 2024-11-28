import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
    return (
        <section className="relative bg-[#F8D252] w-full h-[75vh] flex items-start justify-start">
          {/* Main hero content container */}
          <div className=" h-full p-6 pt-48 px-20 ml-20">
            {/* Text container */}
            <div className="flex flex-col items-start mb-5  ">
              <h1 className="text-4xl font-inter font- text-black mb-4">A shared space for minds to connect,</h1>
              <h1 className=' text-4xl font-inter font-bold'>create & inspire</h1>
            </div>
        
            {/* Form container */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs flex flex-col items-center mt-12 ">
              {/* Add "Join or create one" text inside the form */}
             
              <p className="text-center text-[#F19962] font-bold mb-4">join or create one</p>
             
              <form className="w-full flex flex-col">
                {/* Classroom Name Field */}
                <input
                  type="text"
                  placeholder="Classroom Name"
                  className="w-full p-2 mb-4 border rounded"
                />
                {/* Date and Time Fields in a row */}
                <div className="flex w-full gap-4 mb-4">
                  <input
                    type="date"
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    type="time"
                    className="flex-1 p-2 border rounded"
                  />
                </div>
                {/* Description Field */}
                <textarea
                  placeholder="Description"
                  className="w-full p-2 mb-4 border rounded"
                ></textarea>
                
                {/* Radio buttons for Public/Private */}
                <div className="flex justify-between mb-4 w-full">
                  <label className="flex items-center text-[#F19962]">
                    <input type="radio" name="visibility" value="public" className="mr-2" />
                    Public
                  </label>
                  <label className="flex items-center text-[#F19962]">
                    <input type="radio" name="visibility" value="private" className="mr-2"  />
                    Private
                  </label>
                </div>
        
                {/* Create Button */}
                <button
                  type="submit"
                  className="bg-[#F19962] text-white font-bold py-2 px-4 rounded hover:bg-[#e08e57] transition"
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        
          {/* Image on the right side */}
          <div className="absolute right-1 bottom-[-60px] flex items-center justify-start">
            <Image
              src="/assets/Home.png" 
              alt="Student reading"
              width={700}
              height={700}
            />
          </div>
        </section>
      );
    };
export default HeroSection;
