import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => { e.preventDefault(); await login({ email, password }); nav('/'); };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-4 font-serif text-4xl">Login</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg bg-white/10 p-3" placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg bg-white/10 p-3" placeholder="Password" />
        <button className="w-full rounded-lg bg-gold-gradient p-3 text-black">Sign in</button>
      </form>
      <div className="mt-4">
        <GoogleLogin onSuccess={() => loginWithGoogle({ email: 'google-user@rivara.com', name: 'Google User', googleId: 'mock' }).then(() => nav('/'))} onError={() => {}} />
      </div>
    </div>
  );
}
