import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';



function ThemeToggler() {
    const [darkTheme,setDarkTheme] = useState<boolean>(false);

    const toggleTheme = () => {
        const t = document.documentElement.classList.toggle('dark');
        setDarkTheme(t);
    }

    useEffect(()=>{
        toggleTheme();
    },[])

  return (
    <Button onClick={toggleTheme} variant='ghost' className='absolute right-3 top-3'>
        {darkTheme? <Sun/>: <Moon/> }
    </Button>
  )
}

export default ThemeToggler