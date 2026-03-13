
import { AuthorityLayout } from "./authority-layout";
import { ShieldCheck, Crosshair, Users, BookOpen, Briefcase, Activity, User } from "lucide-react";

export const ScoringPage = () => {
  return (
    <AuthorityLayout
      title="Identity Confidence Engine"
      subtitle="Analyze how identity scores are calculated and dynamically updated."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Main Scoring Overview */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-sm">
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ahmad Karimi</h2>
                    <p className="text-gray-500 dark:text-gray-400">Case #BB-7821 • Scoring Analysis</p>
                  </div>
                  <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-xl border border-blue-100 dark:border-blue-900/50">
                     <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                     <div>
                       <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Current Confidence</p>
                       <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">65<span className="text-lg font-medium text-blue-500 dark:text-blue-500/70">/100</span></p>
                     </div>
                  </div>
               </div>

               {/* Score Ranges Bar */}
               <div className="mb-10">
                  <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                     <span>0</span>
                     <span>39</span>
                     <span>59</span>
                     <span>79</span>
                     <span>100</span>
                  </div>
                  <div className="h-4 w-full flex rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-red-400/80 w-[40%] flex items-center justify-center relative group cursor-pointer">
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-xs py-1 px-2 rounded transition-opacity whitespace-nowrap">Under Review</span>
                     </div>
                     <div className="h-full bg-yellow-400/80 w-[20%] flex items-center justify-center relative group cursor-pointer">
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-xs py-1 px-2 rounded transition-opacity whitespace-nowrap">Provisional</span>
                     </div>
                     <div className="h-full bg-blue-500 w-[20%] flex items-center justify-center relative group cursor-pointer">
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-xs py-1 px-2 rounded transition-opacity whitespace-nowrap text-center">
                          <span className="font-bold">Verified</span><br/>Current Score Range
                        </span>
                        {/* Indicator Needle */}
                        <div className="absolute top-1/2 left-1/4 w-1.5 h-6 bg-gray-900 dark:bg-white rounded-full -translate-y-1/2 shadow-sm z-10"></div>
                     </div>
                     <div className="h-full bg-green-500/80 w-[20%] flex items-center justify-center relative group cursor-pointer">
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-xs py-1 px-2 rounded transition-opacity whitespace-nowrap">High Confidence</span>
                     </div>
                  </div>
               </div>

               <h3 className="text-lg font-semibold mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">Identity Evidence Graph</h3>
               
               {/* Mock Tree Graph */}
               <div className="relative pt-4 pb-8 pl-4">
                  {/* Vertical line connecting nodes */}
                  <div className="absolute left-[39px] top-6 bottom-16 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                  <div className="space-y-6">
                     <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
                           <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                           <p className="font-semibold text-gray-900 dark:text-gray-100">Ahmad Karimi</p>
                           <p className="text-xs text-gray-500">Subject Root Node</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 relative z-10 ml-8">
                        {/* Horizontal connecting line */}
                        <div className="absolute -left-8 top-1/2 w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-sm shrink-0">
                           <Crosshair className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex justify-between items-center shadow-sm">
                           <div>
                              <p className="font-semibold text-sm">Biometric Match</p>
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Verified by UNHCR DB</p>
                           </div>
                           <span className="font-bold text-green-600 dark:text-green-400 px-3 py-1 bg-green-50 dark:bg-green-900/10 rounded-full text-sm">+30 pts</span>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 relative z-10 ml-8">
                        <div className="absolute -left-8 top-1/2 w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-200 dark:border-purple-800 shadow-sm shrink-0">
                           <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex justify-between items-center shadow-sm">
                           <div>
                              <p className="font-semibold text-sm">Family Confirmation</p>
                              <p className="text-xs text-gray-500 font-medium">Wife (Verified Record)</p>
                           </div>
                           <span className="font-bold text-green-600 dark:text-green-400 px-3 py-1 bg-green-50 dark:bg-green-900/10 rounded-full text-sm">+20 pts</span>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 relative z-10 ml-8">
                        <div className="absolute -left-8 top-1/2 w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center border border-yellow-200 dark:border-yellow-800 shadow-sm shrink-0">
                           <Activity className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex justify-between items-center shadow-sm">
                           <div>
                              <p className="font-semibold text-sm">NGO Validation</p>
                              <p className="text-xs text-gray-500 font-medium">Local Aid Organization</p>
                           </div>
                           <span className="font-bold text-green-600 dark:text-green-400 px-3 py-1 bg-green-50 dark:bg-green-900/10 rounded-full text-sm">+15 pts</span>
                        </div>
                     </div>

                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Breakdown */}
         <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
               <h3 className="font-semibold border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">Pending Points</h3>
               
               <div className="space-y-4">
                 <div className="border border-gray-200 dark:border-gray-700 border-dashed rounded-lg p-3 bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                         <BookOpen className="h-4 w-4 text-gray-400" />
                         <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Education Record</span>
                       </div>
                       <span className="text-xs font-bold text-gray-500">Up to +10</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Waiting for translation check.</p>
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Review Now →</button>
                 </div>

                 <div className="border border-gray-200 dark:border-gray-700 border-dashed rounded-lg p-3 bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                         <Briefcase className="h-4 w-4 text-gray-400" />
                         <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Employer Reference</span>
                       </div>
                       <span className="text-xs font-bold text-gray-500">Up to +12</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Contact attempted, pending response.</p>
                 </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-sm text-white">
               <h3 className="font-semibold mb-2">Score Ranges Guide</h3>
               <ul className="text-sm space-y-3 opacity-90">
                 <li className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-red-300 font-medium">0–39</span> <span>Under Review</span>
                 </li>
                 <li className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-yellow-300 font-medium">40–59</span> <span>Provisional</span>
                 </li>
                 <li className="flex justify-between border-b border-white/10 pb-2">
                   <span className="text-blue-300 font-medium">60–79</span> <span>Verified</span>
                 </li>
                 <li className="flex justify-between">
                   <span className="text-green-300 font-medium">80+</span> <span>High Confidence</span>
                 </li>
               </ul>
            </div>
         </div>
      </div>
    </AuthorityLayout>
  );
};
