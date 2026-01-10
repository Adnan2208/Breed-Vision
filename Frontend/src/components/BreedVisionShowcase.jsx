import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const BreedVisionShowcase = () => {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const stageRef = useRef(null);
    const cowRef = useRef(null);
    const probRef = useRef(null);
    const gridRef = useRef(null);
    const beamRef = useRef(null);
    const impactRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const stage = stageRef.current;
        const cow = cowRef.current;
        const prob = probRef.current;
        const grid = gridRef.current;
        const beam = beamRef.current;
        const impact = impactRef.current;

        // Mouse interaction for 3D card effect
        const handleMouseMove = (e) => {
            const rect = stage.getBoundingClientRect();
            const x = (rect.width / 2 - (e.clientX - rect.left)) / 15;
            const y = (rect.height / 2 - (e.clientY - rect.top)) / 15;

            gsap.to(card, {
                rotationY: x,
                rotationX: y,
                duration: 0.4,
                ease: "power2.out"
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, { rotationY: -15, rotationX: 5, duration: 0.8 });
        };

        stage.addEventListener('mousemove', handleMouseMove);
        stage.addEventListener('mouseleave', handleMouseLeave);

        // Smooth scroll behavior
        gsap.utils.toArray('.step-section').forEach((section) => {
            gsap.fromTo(section,
                { opacity: 0.3, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "top 30%",
                        scrub: 1
                    }
                }
            );
        });

        // PHASE 2: PROBLEM Animation
        gsap.timeline({
            scrollTrigger: {
                trigger: "#step-prob",
                start: "top center",
                end: "bottom center",
                scrub: 1
            }
        })
            .to(cow, { filter: "grayscale(100%) contrast(1.2)", scale: 0.85 })
            .to(prob, { opacity: 1, scale: 1 }, "<");

        // PHASE 3: SOLUTION Animation
        gsap.timeline({
            scrollTrigger: {
                trigger: "#step-sol",
                start: "top center",
                end: "bottom center",
                scrub: 1
            }
        })
            .to(prob, { opacity: 0, scale: 0 })
            .to(cow, { filter: "grayscale(0%)", scale: 1, y: -20 })
            .to(grid, { opacity: 0.3 })
            .fromTo(beam, { top: "0%", opacity: 1 }, { top: "100%", opacity: 1, duration: 2 });

        // PHASE 4: IMPACT Animation
        gsap.timeline({
            scrollTrigger: {
                trigger: "#step-imp",
                start: "top center",
                end: "bottom center",
                scrub: 1
            }
        })
            .to(grid, { opacity: 0 })
            .to(beam, { opacity: 0 })
            .to(cow, { y: 0, scale: 1.2, ease: "elastic.out(1, 0.5)" })
            .to(impact, { opacity: 1, scale: 1, y: -10, ease: "back.out(1.7)" });

        return () => {
            stage.removeEventListener('mousemove', handleMouseMove);
            stage.removeEventListener('mouseleave', handleMouseLeave);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section className="relative" ref={containerRef}>
            <div className="flex relative">
                {/* LEFT: Sticky Visual Stage */}
                <div
                    ref={stageRef}
                    className="w-1/2 h-screen sticky top-0 flex justify-center items-center z-10 overflow-hidden"
                    style={{ perspective: '1200px' }}
                >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />



                    {/* The 3D Card */}
                    <div
                        ref={cardRef}
                        className="relative w-[340px] h-[480px] cursor-pointer group"
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: 'rotateY(-15deg) rotateX(5deg)'
                        }}
                    >
                        {/* Card Background */}
                        <div className="absolute inset-0 bg-white rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden transition-all duration-500 group-hover:shadow-[0_50px_100px_rgba(15,118,110,0.2),0_0_40px_rgba(255,255,255,0.8)] group-hover:border-primary/30">
                            <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[60%] bg-gradient-to-b from-primary/10 to-transparent rounded-[50%] transition-all duration-500 group-hover:from-primary/20" />

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent" />
                            </div>
                        </div>

                        {/* Cow Image with Enhanced Hover */}
                        <img
                            ref={cowRef}
                            src="https://cdn-icons-png.flaticon.com/512/2395/2395796.png"
                            alt="Cattle"
                            className="absolute top-1/2 left-1/2 w-[280px] transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_30px_40px_rgba(15,118,110,0.3)]"
                            style={{
                                transform: 'translate(-50%, -50%) translateZ(40px)',
                                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))'
                            }}
                        />



                        {/* Warning Icon (Problem) */}
                        <div
                            ref={probRef}
                            className="absolute top-5 right-5 text-5xl opacity-0"
                            style={{
                                transform: 'translateZ(60px)',
                                animation: 'bounce-slight 2s infinite'
                            }}
                        >
                            ⚠️
                        </div>

                        {/* Scanner Grid (Solution) */}
                        <div
                            ref={gridRef}
                            className="absolute inset-0 opacity-0 rounded-[40px] overflow-hidden"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(15,118,110,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.5) 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}
                        />

                        {/* Scanner Beam (Solution) */}
                        <div
                            ref={beamRef}
                            className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 z-20 rounded-full"
                            style={{ boxShadow: '0 0 30px rgba(15,118,110,0.8), 0 0 60px rgba(15,118,110,0.4)' }}
                        />

                        {/* Success Badge (Impact) */}
                        <div
                            ref={impactRef}
                            className="absolute bottom-10 left-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full font-bold text-lg whitespace-nowrap opacity-0"
                            style={{
                                transform: 'translateX(-50%) translateZ(70px) scale(0)',
                                boxShadow: '0 10px 30px rgba(46, 213, 115, 0.5), 0 0 20px rgba(46, 213, 115, 0.3)'
                            }}
                        >
                            ✅ Breed: GIR
                        </div>
                    </div>
                </div>

                {/* RIGHT: Scrolling Content */}
                <div className="w-1/2 bg-white shadow-[-5px_0_30px_rgba(0,0,0,0.02)] z-20 pb-[20vh]">
                    {/* AIM Section */}
                    <div id="step-aim" className="step-section min-h-[75vh] flex flex-col justify-center px-[12%] box-border">
                        <div className="text-text-muted font-bold tracking-widest mb-3 text-sm animate-pulse">PROJECT OVERVIEW</div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-text leading-tight mb-6 hover-lift">
                            BREED <span className="text-primary hover:text-primary-light transition-colors duration-300">VISION</span>
                        </h1>
                        <p className="text-xl text-text mb-4 hover-slide">
                            <span className="font-bold">AIM:</span> To ensure accurate identification and recording of cattle breeds in India at the field level using AI.
                        </p>
                        <p className="text-lg text-text-secondary leading-relaxed mb-8 hover-slide">
                            We are making animal health, breeding programs, government schemes, and farmer productivity <span className="font-bold text-text">data-driven, effective, and reliable.</span>
                        </p>
                        <div className="text-text-muted flex items-center gap-2 scroll-indicator">
                            <span className="animate-bounce">↓</span> Scroll to see the journey
                        </div>
                    </div>

                    {/* PROBLEM Section */}
                    <div id="step-prob" className="step-section min-h-[75vh] flex flex-col justify-center px-[12%] box-border">
                        <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-secondary group cursor-default">
                            <span className="w-3 h-3 rounded-full bg-secondary group-hover:scale-150 transition-transform duration-300" />
                            <span className="hover:translate-x-2 transition-transform duration-300">The Problem</span>
                        </h2>
                        <p className="text-lg text-text-secondary leading-relaxed mb-4 hover-slide">
                            India has the world's largest cattle population but one of the most <span className="font-bold text-text underline-animated">inefficient cattle management systems.</span>
                        </p>
                        <p className="text-text-secondary mb-4 hover-slide">Despite government initiatives like <em className="text-secondary">Pashu Aadhaar</em>, <em className="text-secondary">Rashtriya Gokul Mission (RGM)</em>, and <em className="text-secondary">Bharat Pashudhan</em>, four major issues persist:</p>

                        <div className="bg-secondary/5 rounded-2xl p-6 border-l-4 border-secondary mt-4 hover:bg-secondary/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="space-y-4">
                                {[
                                    'Cattle loss due to delayed or incorrect treatment.',
                                    'Low milk yield and farmer income due to lack of breed-specific knowledge.',
                                    'RGM underperformance because genetic improvement targets wrong animals.',
                                    'Incorrect breed data entered by FLWs who are not breed experts.'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-text font-medium group/item hover:translate-x-2 transition-transform duration-300 cursor-default">
                                        <span className="text-secondary text-xl leading-none group-hover/item:scale-125 transition-transform duration-300">•</span>
                                        <span className="group-hover/item:text-secondary transition-colors duration-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="mt-6 font-bold text-secondary text-lg hover:scale-105 transition-transform duration-300 origin-left cursor-default">
                            👉 ROOT CAUSE: Incorrect or unreliable breed identification at the time of animal registration.
                        </p>
                    </div>

                    {/* SOLUTION Section */}
                    <div id="step-sol" className="step-section min-h-[75vh] flex flex-col justify-center px-[12%] box-border">
                        <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-primary group cursor-default">
                            <span className="w-3 h-3 rounded-full bg-primary group-hover:scale-150 transition-transform duration-300" />
                            <span className="hover:translate-x-2 transition-transform duration-300">The Solution</span>
                        </h2>
                        <p className="text-lg text-text-secondary leading-relaxed mb-6 hover-slide">
                            <span className="font-bold text-text">Breed Vision</span> is an AI-powered cattle breed recognition system that supports Field Level Workers (FLWs) at the moment of registration.
                        </p>

                        <div className="bg-primary/5 rounded-2xl p-6 border-l-4 border-primary hover:bg-primary/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="space-y-5">
                                {[
                                    { num: 1, title: 'Capture:', desc: 'FLW takes a photo of the animal.' },
                                    { num: 2, title: 'Predict:', desc: 'Computer vision model predicts breed with confidence score.' },
                                    { num: 3, title: 'Verify:', desc: "Combines Farmer's Knowledge + FLW Experience + AI Prediction." }
                                ].map((step) => (
                                    <div key={step.num} className="flex items-start gap-4 group/step hover:translate-x-2 transition-transform duration-300 cursor-default">
                                        <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover/step:scale-110 group-hover/step:shadow-lg group-hover/step:shadow-primary/30 transition-all duration-300">{step.num}</span>
                                        <div>
                                            <span className="font-bold text-text">{step.title}</span>
                                            <span className="text-text-secondary"> {step.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="mt-6 text-text-secondary hover-slide">
                            <span className="font-bold text-text">Integrates with:</span> Bharat Pashudhan, Veterinary and RGM teams, and Farmer Advisory Systems for breed-specific guidance in regional languages.
                        </p>
                    </div>

                    {/* IMPACT Section */}
                    <div id="step-imp" className="step-section min-h-[75vh] flex flex-col justify-center px-[12%] box-border">
                        <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-green-500 group cursor-default">
                            <span className="w-3 h-3 rounded-full bg-green-500 group-hover:scale-150 transition-transform duration-300" />
                            <span className="hover:translate-x-2 transition-transform duration-300">The Impact</span>
                        </h2>
                        <p className="text-lg text-text-secondary leading-relaxed mb-6 hover-slide">
                            By starting with a single photo, Breed Vision transforms cattle identification into a <span className="font-bold text-text">reliable decision-support system</span>, helping turn India's cattle population from a mismanaged burden into a <span className="font-bold text-green-500">Productive National Asset.</span>
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { text: 'Clean & Reliable Data', icon: '📊' },
                                { text: 'Higher Milk Yield', icon: '🥛' },
                                { text: 'Better Animal Health', icon: '❤️' },
                                { text: 'Effective RGM Outcomes', icon: '🎯' },
                                { text: 'Increased Farmer Income', icon: '💰' },
                                { text: 'Better Policy Decisions', icon: '📋' }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="impact-card bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 cursor-default group"
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    <span className="text-3xl mb-3 block group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{item.icon}</span>
                                    <span className="font-bold text-green-600 group-hover:text-green-500 transition-colors duration-300">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animation Styles */}
            <style>{`
                @keyframes bounce-slight {
                    0%, 100% { transform: translateZ(60px) translateY(0); }
                    50% { transform: translateZ(60px) translateY(-10px); }
                }
                
                @keyframes float-particle {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
                    50% { transform: translateY(-30px) translateX(10px); opacity: 0.8; }
                }
                
                .particle {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                    animation: float-particle 4s ease-in-out infinite;
                }
                
                .particle-1 { top: 20%; left: 20%; animation-delay: 0s; }
                .particle-2 { top: 60%; left: 70%; animation-delay: 1.3s; }
                .particle-3 { top: 80%; left: 30%; animation-delay: 2.6s; }
                
                .hover-lift {
                    transition: transform 0.3s ease, text-shadow 0.3s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                    text-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                
                .hover-slide {
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }
                .hover-slide:hover {
                    transform: translateX(10px);
                }
                
                .underline-animated {
                    background-image: linear-gradient(var(--color-secondary), var(--color-secondary));
                    background-size: 0% 2px;
                    background-position: 0 100%;
                    background-repeat: no-repeat;
                    transition: background-size 0.4s ease;
                }
                .underline-animated:hover {
                    background-size: 100% 2px;
                }
                
                .scroll-indicator {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
                
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                
                .impact-card {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .impact-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(46, 213, 115, 0.2), 0 0 0 2px rgba(46, 213, 115, 0.3);
                }
            `}</style>
        </section>
    );
};

export default BreedVisionShowcase;
