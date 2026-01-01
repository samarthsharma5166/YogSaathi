import React from "react";

const testimonials = [
    {
        name: "Sanjeev Kumar Paul",
        time: "62 Years",
        location: "Kolkata",
        image: "/user1.jpeg",
        text: `Yogsaathi has changed my life. Their unique way of teaching yoga—such as having a separate area of focus on each day, flexible timing, and multiple instructors with their unique yet well-coordinated way of instruction—has perfectly fitted my requirements.

I am much fitter and more confident after doing online yoga with them for about two months now. I would wholeheartedly recommend Yogsaathi to anyone seeking a holistic and convenient way to integrate yoga into their daily life for flexibility, concentration, and overall well-being.`,
    },
    {
        name: "Vaibhav Maheshwari",
        time: "39 Years",
        location: "Pune",
        image: "/user2.jpeg",
        text: `YogSaathi has been a wonderful addition to my daily routine. The flexible class timings make it easy to stay consistent despite a busy schedule.

The teachers are highly skilled and patient, clearly guiding each asana with focus on posture and breathing, and offering variations for different fitness levels. What truly stands out is the affordability without compromising on quality.

I highly recommend YogSaathi for authentic and well-guided online yoga classes.`,
    },
    {
        name: "Sandeep Banthia",
        time: "33 Years",
        location: "Gurgaon",
        image: "/user3.jpeg",
        text: `Practicing yoga with YogSaathi has brought noticeable improvement in my flexibility, helped me manage stress better, and improved the quality of my sleep.

What makes YogSaathi especially suitable for working professionals is the availability of classes six times a day, making it easy to fit yoga into a busy schedule.

I highly recommend YogSaathi to everyone looking for a convenient and well-guided online yoga experience.`,
    },
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-4">
                <h4 className="text-center text-black font-medium">
                    Testimonials
                </h4>
                <h2 className="text-center text-3xl font-bold text-black mb-14">
                    What Our Members Say
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center 
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-38 h-38 rounded-full object-cover mb-4 border-2 border-[#4CAF50]"
                            />

                            <h3 style={{ marginBottom: "0.5rem" }} className="font-bold text-black text-lg">
                                {item.name}
                            </h3>

                            {item.time ??
                                <p
                                    className="!text-xs !text-gray-500 !mb-4"
                                >
                                    {item.time}
                                </p>}

                            <span className="text-xs text-gray-500 mb-4">
                                {item.location}
                            </span>

                            <p className="text-gray-600 text-sm leading-relaxed">
                                “{item.text}”
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
