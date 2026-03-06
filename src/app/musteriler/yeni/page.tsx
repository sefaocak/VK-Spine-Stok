"use client";

import { useState } from 'react';
import { UserPlus, ArrowLeft, Info, Building, MapPin, Hash, CheckCircle, AlertCircle, Loader2, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function FieldHint({ text }: { text: string }) {
    return <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Info className="w-3 h-3 shrink-0" />{text}</p>;
}

export default function YeniMusteriPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        name: '',
        taxOffice: '',
        taxNumber: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Alan bazlı karakter limiti kontrolleri
        if (name === 'phone' && value.replace(/\D/g, '').length > 11) return;
        if (name === 'taxNumber' && value.replace(/\D/g, '').length > 11) return;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Hata varsa temizle
        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) errors.name = 'Müşteri adı zorunludur.';
        if (formData.phone && !/^[0-9\s\+\-\(\)]{10,15}$/.test(formData.phone.trim())) {
            errors.phone = 'Geçerli bir telefon numarası girin (örn: 0532 123 45 67)';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            errors.email = 'Geçerli bir e-posta adresi girin.';
        }
        if (formData.taxNumber && !/^\d{10,11}$/.test(formData.taxNumber.trim())) {
            errors.taxNumber = 'Vergi/TC numarası 10 veya 11 haneli olmalıdır.';
        }
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setLoading(true);
        setErrorMsg('');
        setSuccess(false);

        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Kayıt sırasında bir hata oluştu.');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/musteriler');
                router.refresh();
            }, 2000);

        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field: string) =>
        `w-full px-4 py-2 bg-slate-50 border ${fieldErrors[field] ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'} rounded-lg focus:ring-2 outline-none transition-all`;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/musteriler" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" /> Müşterilere Dön
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <UserPlus className="w-6 h-6 text-blue-600" />
                        Yeni Müşteri / Hastane Kartı
                    </h1>
                    <p className="text-slate-500 mt-1">Sisteme yeni bir özel hastane, devlet kurumu veya müşteri tanımlayın.</p>
                </div>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="font-medium">Müşteri/Hastane başarıyla eklendi. Listeye yönlendiriliyorsunuz...</p>
                </div>
            )}
            {errorMsg && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <p className="font-medium">{errorMsg}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* 1. Kurumsal Bilgiler */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-500" /> 1. Şirket / Kurum Bilgileri
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Açık Ünvanı / Hastane Adı <span className="text-rose-500">*</span></label>
                                    <input required name="name" value={formData.name} onChange={handleChange} type="text"
                                        className={inputClass('name')} placeholder="Örn: X Özel Sağlık Hizmetleri A.Ş." maxLength={200} />
                                    {fieldErrors.name && <p className="text-xs text-rose-500 mt-1">{fieldErrors.name}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Vergi Dairesi</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="taxOffice" value={formData.taxOffice} onChange={handleChange} type="text"
                                            className={`${inputClass('taxOffice')} pl-9`} placeholder="Örn: Şişli V.D." maxLength={100} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Vergi Numarası / TCKN</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="taxNumber" value={formData.taxNumber} onChange={handleChange} type="text"
                                            className={`${inputClass('taxNumber')} pl-9 font-mono`}
                                            placeholder="10 veya 11 haneli numara" maxLength={11} />
                                    </div>
                                    {fieldErrors.taxNumber
                                        ? <p className="text-xs text-rose-500 mt-1">{fieldErrors.taxNumber}</p>
                                        : <FieldHint text="Vergi no: 10 hane, TCKN: 11 hane" />}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Müşteri / Kurum Tipi</label>
                                    <select className={inputClass('type')}>
                                        <option>Özel Hastane</option>
                                        <option>Devlet / Eğitim Araştırma Hastanesi</option>
                                        <option>Bayi / Alt Satıcı</option>
                                        <option>Şahıs Firması (Dr)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 2. İletişim ve Adres */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-500" /> 2. İletişim ve Adres
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Yetkili Kişi (Satınalma / Depo)</label>
                                    <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} type="text"
                                        className={inputClass('contactPerson')} placeholder="Ad Soyad" maxLength={100} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">İletişim Telefonu</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="phone" value={formData.phone} onChange={handleChange} type="tel"
                                            className={`${inputClass('phone')} pl-9 font-mono`}
                                            placeholder="0532 123 45 67" maxLength={15} />
                                    </div>
                                    {fieldErrors.phone
                                        ? <p className="text-xs text-rose-500 mt-1">{fieldErrors.phone}</p>
                                        : <FieldHint text="Başında 0 ile, boşluklu veya bitişik yazılabilir" />}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">E-Posta Adresi</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="email" value={formData.email} onChange={handleChange} type="email"
                                            className={`${inputClass('email')} pl-9`} placeholder="ornek@hastane.com" maxLength={150} />
                                    </div>
                                    {fieldErrors.email && <p className="text-xs text-rose-500 mt-1">{fieldErrors.email}</p>}
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Açık Adres Bilgisi</label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} rows={2}
                                        className={`${inputClass('address')} resize-y`} placeholder="Fatura veya sevk adresi..." maxLength={500} />
                                    <FieldHint text="Fatura veya teslimat adresi (maks. 500 karakter)" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Özel Notlar</label>
                                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2}
                                        className={`${inputClass('notes')} resize-y`} placeholder="Cari ile ilgili eklenmek istenen notlar..." maxLength={500} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <Link href="/musteriler" className="px-6 py-2.5 text-slate-600 bg-white border border-slate-200 rounded-lg font-bold hover:bg-slate-50 transition-colors">Vazgeç</Link>
                            <button disabled={loading} type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md disabled:bg-blue-400">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Müşteriyi Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
