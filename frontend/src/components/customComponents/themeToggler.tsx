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
    <Button onClick={toggleTheme} variant='ghost'>
        {darkTheme? <Sun/>: <Moon/> }
    </Button>
  )
}

export default ThemeToggler