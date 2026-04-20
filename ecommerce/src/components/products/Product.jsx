import React from 'react'
import { useGetProductByIdQuery } from '../../apis/fakeStoreApi'
import { useParams } from 'react-router';

const Product = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductByIdQuery(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred while fetching product.</div>;


  return (
    <div>
      <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>{data?.title}</h1>
      <img src={data?.image} alt={data?.title} className='w-64 h-64 object-contain mx-auto mb-4' />
      <p className='text-gray-600 mb-4'>{data?.description}</p>
      <p className='text-2xl font-bold text-gray-800'>&#8358; {data?.price}</p>
    </div>
  )
}

export default Product