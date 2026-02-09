"use client";

export default function ProblemSection() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-emerald-500 uppercase mb-2">
            Problem
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Too much time wasted looking for sponsors?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No more random prospecting. Get direct access to sponsors most likely
            to collaborate with you.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* WITHOUT */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="font-semibold text-gray-900 mb-6">
              Without <span className="font-bold">SponsorMatch</span>
            </h3>

            <ul className="space-y-4 text-gray-700">
              {[
                "Wasting time with manual searches",
                "Too many unsponsored videos = missed opportunities",
                "Spending time with uninterested sponsors",
                "Difficulty finding immediate sponsorship opportunities",
                "Wasting hours searching for brand contacts online",
                "Searching through saturated sponsor databases",
                "Lack of visibility in the sponsorship market",
                "Sending mass emails hoping for responses",
                "Passively waiting for sponsors to contact you",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WITH */}
          <div className="bg-emerald-50 rounded-2xl p-8 relative overflow-hidden">
            <h3 className="font-semibold text-gray-900 mb-6">
              With <span className="font-bold">SponsorMatch</span>
            </h3>

            <div className="grid gap-4">
              {[
                {
                  title: "Access the entire up-to-date sponsorship market",
                  text: "View all brands, collaborations, and opportunities in one place.",
                },
                {
                  title: "Quick and efficient search",
                  text: "Find relevant sponsors in just a few clicks using advanced filters.",
                },
                {
                  title: "Personalized recommendations",
                  text: "Receive ready-to-collaborate brands tailored to your profile.",
                },
                {
                  title: "Email alerts",
                  text: "Stay informed about new opportunities in real time.",
                },
                {
                  title: "Get decision-maker contacts in 1 click",
                  text: "No more endless searches — everything is at your fingertips.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 shadow-sm border"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-500 mt-1">✔</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
