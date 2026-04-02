/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  ChevronDown, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";

interface AdmissionDetailsProps {
  form: Form;
  selectedMatch: Match;
  admissionPct: number;
  admissionBand: { label: string; colorName?: string; badgeClass?: string };
  onBack: () => void;
  onAdvanceToVisa: () => void;
}

export function AdmissionDetails({
  form,
  selectedMatch,
  admissionPct,
  admissionBand,
  onBack,
  onAdvanceToVisa
}: AdmissionDetailsProps) {
  const gpa = parseFloat(form.gpa) || 0;
  const testScore = parseFloat(form.testScore) || 0;
  
  const isGpaStrong = gpa >= 3.0;
  const isTestStrong = (form.testType === "IELTS" && testScore >= 6.5) || 
                       (form.testType === "PTE" && testScore >= 60) || 
                       (form.testType === "TOEFL" && testScore >= 90) ||
                       (form.testType === "Duolingo" && testScore >= 115);

  const analysisItems = [
    {
      label: `GPA: ${isGpaStrong ? "Competitive" : "Moderate"} (${gpa}${gpa <= 4 ? "/4.0" : "/100"})`,
      isPositive: isGpaStrong,
      icon: isGpaStrong ? CheckCircle2 : ShieldAlert,
      color: isGpaStrong ? "text-emerald-600" : "text-amber-800",
      bg: isGpaStrong ? "bg-emerald-100" : "bg-amber-100"
    },
    {
      label: `Test Score: ${isTestStrong ? "Target Met" : "Below Average"} (${form.testType} ${form.testScore})`,
      isPositive: isTestStrong,
      icon: isTestStrong ? CheckCircle2 : ShieldAlert,
      color: isTestStrong ? "text-emerald-600" : "text-amber-800",
      bg: isTestStrong ? "bg-emerald-100" : "bg-amber-100"
    },
    {
      label: `Background: ${parseInt(form.backlogs) === 0 ? "No Backlogs" : `${form.backlogs} Backlogs Identified`}`,
      isPositive: parseInt(form.backlogs) === 0,
      icon: parseInt(form.backlogs) === 0 ? CheckCircle2 : ShieldAlert,
      color: parseInt(form.backlogs) === 0 ? "text-emerald-600" : "text-rose-800",
      bg: parseInt(form.backlogs) === 0 ? "bg-emerald-100" : "bg-rose-100"
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-full px-4 pb-32 space-y-5 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4 italic uppercase tracking-tighter">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-1"><ChevronLeft className="w-6 h-6 text-slate-900" /></button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Admission Chance</h1>
         </div>
         <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md">
            <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" width={44} height={44} alt="U" />
         </div>
      </div>

      <Card className="p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
         <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-4">
               <p className="text-[13px] font-bold text-slate-600 leading-none tracking-tight">Admission Probability</p>
               <h2 className="text-2xl font-black text-slate-900 leading-tight">
                 {admissionPct}% <span className="text-blue-600">— {admissionBand.label}</span>
               </h2>
               <div className="inline-flex px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">
                 ● Profile Match: {Math.round(admissionPct * 0.9)}%
               </div>
            </div>
            <div className="relative w-24 h-24 shrink-0">
               <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 scale-110">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                  <circle 
                    cx="18" cy="18" r="16" 
                    fill="transparent" 
                    stroke={admissionPct > 70 ? "#10b981" : admissionPct > 40 ? "#f59e0b" : "#ef4444"} 
                    strokeWidth="4" 
                    strokeDasharray={`${admissionPct} 100`} 
                    strokeLinecap="round" 
                  />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-lg font-black text-slate-900">{admissionPct}%</span>
               </div>
            </div>
         </div>
      </Card>

      <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
         <div className="p-5 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
            <span className="font-bold text-slate-800 uppercase text-[12px] tracking-widest">Your Profile Analysis</span>
            <ChevronDown className="w-5 h-5 text-slate-300" />
         </div>
         <div className="px-5 py-6 space-y-6">
            {analysisItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm border border-white`}>
                   <item.icon className="w-5 h-5" />
                 </div>
                 <div className="space-y-0.5">
                   <p className="text-[14px] font-black text-slate-800 leading-none">{item.label}</p>
                   <p className={`text-[10px] font-bold uppercase tracking-tight ${item.isPositive ? "text-emerald-500" : "text-amber-500"}`}>
                     {item.isPositive ? "Strong Point" : "Risk Factor"}
                   </p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Suggested University Cards */}
      <div className="pt-6 space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight italic">Recommended Safety Picks</h3>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest underline cursor-pointer">View All</span>
         </div>
         <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
            {[selectedMatch, selectedMatch].map((m, i) => (
              <Card key={i} className="min-w-[300px] rounded-[36px] border border-slate-100 overflow-hidden shadow-xl snap-start bg-white group hover:border-blue-200 transition-all duration-500">
                 <div className="h-44 bg-slate-100 relative overflow-hidden">
                    <Image src={m.banner || "/uni-default.webp"} layout="fill" objectFit="cover" alt="U" className="group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 bg-emerald-500/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-white shadow-lg">
                      {Math.min(98, admissionPct + 15)}% CHANCE
                    </div>
                 </div>
                 <div className="p-7 space-y-5">
                    <h4 className="font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{m.name}</h4>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-5">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Tuition</p>
                          <p className="font-black text-slate-900 text-[15px]">NPR {Math.round((m.tuitionFee || 22000) * 1.38 / 100000)} Lakhs</p>
                       </div>
                       <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl uppercase border border-emerald-100">SAFE</span>
                    </div>
                 </div>
              </Card>
            ))}
         </div>
      </div>
      <button onClick={onAdvanceToVisa} className="w-full h-18 bg-blue-600 text-white rounded-[28px] font-black text-[15px] uppercase tracking-widest shadow-[0_20px_40px_-5px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 mt-10 group hover:bg-blue-700 transition-all active:scale-95 duration-300 italic">Check Visa Probability <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></button>
    </div>
  );
}
