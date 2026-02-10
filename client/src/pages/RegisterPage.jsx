import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async (e) => { e.preventDefault(); await register(form); nav('/login'); };
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-4 font-serif text-4xl">Create Account</h1>
      <form className="space-y-3" onSubmit={submit}>
        {['name', 'email', 'password'].map((k) => <input key={k} type={k === 'password' ? 'password' : 'text'} className="w-full rounded-lg bg-white/10 p-3" placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />)}
        <button className="w-full rounded-lg bg-gold-gradient p-3 text-black">Register</button>
      </form>
    </div>
  );
}
