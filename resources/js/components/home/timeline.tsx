import { Event } from '@/types/event';
import { FormattedDateWithOutTime } from '@/utils/formated-date';
import { motion } from 'framer-motion';
import { MapPinPlus, YoutubeIcon } from 'lucide-react';

export default function TimelineSection({ timeline }: { timeline: Event[] }) {
    const now = new Date();

    console.log(now);
    return (
        <>
            <section className="relative overflow-hidden py-16 md:py-24">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/40 to-red-100/30"></div>
                <div className="relative z-10 mx-auto max-w-[1350px] px-4 md:px-8 lg:px-12">
                    <div className="mb-8 text-center md:mb-12">
                        <h2 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl" data-aos="fade-up">
                            Event <span className="text-red-600">Timeline</span>
                        </h2>
                        <div className="mx-auto h-1 w-20 rounded-full bg-red-600 sm:w-24" data-aos="fade-up" data-aos-delay="50"></div>
                    </div>

                    <div className="relative mx-auto flex w-full flex-col items-center">
                        <div
                            className="timeline-line absolute top-0 left-1/2 hidden h-full w-2 -translate-x-1/2 transform md:block"
                            data-aos="fade-down"
                            data-aos-duration="1500"
                            data-aos-delay="200"
                            data-aos-easing="ease-out-cubic"
                        />

                        <div
                            className="timeline-line absolute top-0 left-6 h-full w-2 md:hidden"
                            data-aos="fade-down"
                            data-aos-duration="1500"
                            data-aos-delay="200"
                            data-aos-easing="ease-out-cubic"
                        />

                        {timeline.map((item, index) => {
                            const isLeft = index % 2 === 0;
                            const isPast = item.end_date && new Date(item.end_date) < now;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={`mb-8 flex w-full flex-col md:mb-16 ${
                                        isLeft
                                            ? 'pl-12 md:items-end md:self-start md:pr-4 md:pl-0'
                                            : 'pl-12 md:items-start md:self-end md:pl-0 md:pl-4'
                                    } items-start md:w-1/2`}
                                >
                                    <div
                                        className={`relative w-full max-w-md rounded-xl border p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl sm:p-6 ${
                                            isPast
                                                ? 'border-gray-300 bg-gray-100 text-gray-500 opacity-80 grayscale-[30%] backdrop-blur-sm backdrop-brightness-90'
                                                : 'border-red-200 bg-white text-gray-800'
                                        }`}
                                    >
                                        {isPast && (
                                            <div className="absolute -top-3 right-3 z-10 rounded-full bg-gray-500 px-3 py-1 text-xs font-bold text-white shadow-md sm:text-sm">
                                                Event Selesai
                                            </div>
                                        )}

                                        <div className="absolute -top-3 left-1/2 hidden -translate-x-1/2 transform md:block">
                                            <div className="relative">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-lg ${
                                                        isPast ? 'bg-gray-400 grayscale' : 'bg-red-500'
                                                    }`}
                                                >
                                                    <div className="text-white">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-6 w-6"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute top-2 -left-[2.4rem] md:hidden">
                                            <div className="relative">
                                                <div
                                                    className={`relative flex h-7 w-7 items-center justify-center rounded-full border-4 border-white shadow-lg ${
                                                        isPast ? 'bg-gray-400 grayscale' : 'bg-red-500'
                                                    }`}
                                                >
                                                    <div className="scale-75 text-white">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-6 w-6"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p
                                            className={`mb-2 text-sm font-medium ${isPast ? 'text-gray-500' : 'text-red-500'} ${
                                                item.end_date ? 'mt-4' : ''
                                            }`}
                                            data-aos="fade-up"
                                            data-aos-duration="1500"
                                            data-aos-delay="200"
                                            data-aos-easing="ease-out-cubic"
                                        >
                                            <FormattedDateWithOutTime date={item.due_date} />
                                            {item.end_date && (
                                                <>
                                                    {' - '}
                                                    <FormattedDateWithOutTime date={item.end_date} />
                                                </>
                                            )}
                                        </p>

                                        <h4 className={`mb-2 text-lg font-semibold sm:text-xl ${isPast ? 'text-gray-500' : 'text-red-600'}`}>
                                            {item.title}
                                        </h4>
                                        <p className="text-sm leading-relaxed text-gray-600 sm:text-base">{item.description}</p>
                                        {item.location && (
                                            <div className="relative mt-3 flex items-center gap-2 text-sm text-gray-500">
                                                {item.location.includes('youtube.com') || item.location.includes('youtu.be') ? (
                                                    <div className="relative">
                                                        <div
                                                            className={`flex h-6 w-6 items-center justify-center rounded-full p-1 text-white shadow ${
                                                                isPast ? 'bg-gray-400 grayscale' : 'bg-red-500'
                                                            }`}
                                                        >
                                                            <YoutubeIcon />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <div
                                                            className={`flex h-6 w-6 items-center justify-center rounded-full p-1 text-white shadow ${
                                                                isPast ? 'bg-gray-400 grayscale' : 'bg-red-500'
                                                            }`}
                                                        >
                                                            <MapPinPlus />
                                                        </div>
                                                    </div>
                                                )}

                                                {item.location.includes('youtube.com') || item.location.includes('youtu.be') ? (
                                                    <a
                                                        href={item.location}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <span className="italic">Watch On YouTube</span>
                                                    </a>
                                                ) : item.location.includes('maps') ? (
                                                    <a
                                                        href={item.location}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <span className="italic">Visit On Google Maps</span>
                                                    </a>
                                                ) : (
                                                    <span className="italic">{item.location}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
