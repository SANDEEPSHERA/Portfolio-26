$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // <!-- emailjs to mail contact form data -->
    let emailjsInitialized = false;
    const EMAILJS_PUBLIC_KEY = "RZ1JM84Fn_WBdehUP";
    const EMAILJS_SERVICE_ID = "service_75l74us";
    const EMAILJS_TEMPLATE_ID = "template_smaw4ug";
    
    function initializeEmailJS() {
        if (typeof emailjs !== 'undefined' && !emailjsInitialized) {
            try {
                emailjs.init(EMAILJS_PUBLIC_KEY);
                emailjsInitialized = true;
                console.log("✅ EmailJS initialized successfully");
            } catch (error) {
                console.error("❌ EmailJS initialization error:", error);
            }
        }
    }

    function waitForEmailJS(callback, maxAttempts = 10) {
        let attempts = 0;
        const checkInterval = setInterval(function() {
            attempts++;
            if (typeof emailjs !== 'undefined') {
                clearInterval(checkInterval);
                initializeEmailJS();
                if (callback) callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error("❌ EmailJS failed to load after", maxAttempts, "attempts");
            }
        }, 500);
    }

    waitForEmailJS();

    $("#contact-form").submit(function (event) {
        event.preventDefault();
        
        const name = $('input[name="name"]').val().trim();
        const email = $('input[name="email"]').val().trim().toLowerCase();
        const phone = $('input[name="phone"]').val().trim();
        const message = $('textarea[name="message"]').val().trim();

        if (!name || !email || !message) {
            alert("Please fill all required fields!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address!");
            return;
        }

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.prop('disabled', true).html('Sending... <i class="fa fa-spinner fa-spin"></i>');

        // Create mailto link with form data
        const subject = encodeURIComponent(`Contact Form: Message from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:sc1797569@gmail.com?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Reset form
        document.getElementById("contact-form").reset();
        alert("✅ Opening your email client. Please send the email from there!");
        submitBtn.prop('disabled', false).html(originalText);
    });

});

// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: [
        "Full Stack Web Development",
        "React Applications",
        "Backend API Development",
        "Building Scalable Web Apps",
        "Android Development"
    ],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500
});
// <!-- typed js effect ends -->

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}

const skillsData = [
    { name: "HTML5", icon: "https://img.icons8.com/color/48/000000/html-5--v1.png" },
    { name: "CSS3", icon: "https://img.icons8.com/color/48/000000/css3.png" },
    { name: "JavaScript", icon: "https://img.icons8.com/color/48/000000/javascript--v1.png" },
    { name: "Bootstrap", icon: "https://img.icons8.com/color/48/000000/bootstrap.png" },
    { name: "React", icon: "https://img.icons8.com/color/48/000000/react-native.png" },
    { name: "Node.js", icon: "https://img.icons8.com/color/48/000000/nodejs.png" },
    { name: "Java", icon: "https://img.icons8.com/color/48/000000/java-coffee-cup-logo--v1.png" },
    { name: "Python", icon: "https://img.icons8.com/color/48/000000/python--v1.png" },
    { name: "MySQL", icon: "https://img.icons8.com/color/48/000000/mysql-logo.png" },
    { name: "GitHub", icon: "https://img.icons8.com/glyph-neue/48/ffffff/github.png" },
    { name: "Android", icon: "https://img.icons8.com/fluency/48/000000/android-os.png" },
    { name: "LeetCode", icon: "https://img.icons8.com/?size=100&id=wDGo581Ea5Nf&format=png&color=000000" }
];

showSkills(skillsData);

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->
