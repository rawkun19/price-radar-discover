
import React, { useState } from 'react';
import { MessageCircle, Send, Star } from 'lucide-react';

const FeedbackSection = () => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      // Create mailto link with feedback
      const subject = encodeURIComponent('PriceRadar Feedback');
      const body = encodeURIComponent(
        `Rating: ${rating}/5 stars\n\nFeedback: ${feedback}\n\nFrom: ${email || 'Anonymous'}`
      );
      window.location.href = `mailto:kunalrawat.dev@gmail.com?subject=${subject}&body=${body}`;
      
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Help Us Improve PriceRadar
          </h2>
          <p className="text-gray-600 text-lg">
            Your feedback helps us build a better price comparison experience for everyone
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your feedback has been sent successfully via email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you rate your experience?
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                      }`}
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Email (optional) */}
              <div>
                <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="feedback-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Feedback text */}
              <div>
                <label htmlFor="feedback-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  id="feedback-text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think about PriceRadar. What features would you like to see? Any issues you encountered?"
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!feedback.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 
                         rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 
                         transition-all duration-200 transform hover:scale-105 
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
                         flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Feedback via Email
              </button>
            </form>
          )}
        </div>

        {/* Alternative contact methods */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm mb-4">
            Prefer other ways to reach out?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:kunalrawat.dev@gmail.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              📧 kunalrawat.dev@gmail.com
            </a>
            <a
              href="https://github.com/Kunal-rawat12"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              🐙 GitHub Issues
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
