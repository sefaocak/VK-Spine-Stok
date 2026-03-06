import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, contactPerson: true }
        });

        return NextResponse.json(customers);
    } catch (error) {
        console.error("Müşteriler getirilirken hata:", error);
        return NextResponse.json({ error: "Müşteriler/Hastaneler alınamadı." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, taxOffice, taxNumber, contactPerson, phone, email, address, notes } = body;

        if (!name || name.trim() === '') {
            return NextResponse.json({ error: "Müşteri/Hastane adı zorunludur." }, { status: 400 });
        }

        const customer = await prisma.customer.create({
            data: {
                name: name.trim(),
                taxOffice: taxOffice?.trim() || null,
                taxNumber: taxNumber?.trim() || null,
                contactPerson: contactPerson?.trim() || null,
                phone: phone?.trim() || null,
                email: email?.trim() || null,
                address: address?.trim() || null,
                notes: notes?.trim() || null,
            }
        });

        return NextResponse.json(customer, { status: 201 });
    } catch (error: any) {
        console.error("Müşteri oluşturulurken hata:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Bu isimde bir müşteri zaten kayıtlı." }, { status: 409 });
        }
        return NextResponse.json({ error: "Müşteri kaydedilemedi." }, { status: 500 });
    }
}
