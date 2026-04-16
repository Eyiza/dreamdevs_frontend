import React, {useState} from 'react'

const Login = () => {

    const userDetails = {
        username: "",
        password: ""
    }

    const [user, setUser] = useState(userDetails);

    function handleChange(e) {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    }
  return (
    <div className='bg-blue-100 flex flex-col items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center justify-center w-full'>
            <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
                <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>Login</h1>
                
                <form className='space-y-6' action="">
                    <div>
                        <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-2'>Username</label>
                        <input name='username' onChange={handleChange} type='text' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter your username' />
                    </div>
                    
                    <div>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                        <input name='password' onChange={handleChange} type='password' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter your password' />
                    </div>
                    
                    <button type='submit' className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200'>Log In</button>
                </form>
                
                {/* <p className='text-center text-sm text-gray-600 mt-4'>Don't have an account? <a href='#' className='text-blue-500 hover:underline'>Sign up</a></p> */}
            </div>
        </div>
    </div>
  )
}

export default Login