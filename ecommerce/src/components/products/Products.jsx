import React from 'react'
import { useGetAllProductsQuery } from '../../apis/fakeStoreApi';

const Products = () => {
  const response = useGetAllProductsQuery();

  console.log(response.data);
  return (
    <div>
        <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>Products</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {response.data?.map((product) => (
                <div key={product.id} className='bg-white rounded-lg shadow-md p-4 flex flex-col items-center'>
                    <img src={product.image} alt={product.title} className='w-32 h-32 object-contain mb-4' />
                    <h2 className='text-lg font-semibold text-gray-800 mb-2'>{product.title}</h2>
                    <p className='text-gray-600 mb-4'>${product.price}</p>
                    <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>Add to Cart</button>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Products
