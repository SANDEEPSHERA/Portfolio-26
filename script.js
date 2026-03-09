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
    // Initialize EmailJS when page loads
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

    // Wait for EmailJS to load
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

    // Initialize when page loads
    waitForEmailJS();

    $("#contact-form").submit(function (event) {
        event.preventDefault();
        
        // Validate form
        const name = $('input[name="name"]').val().trim();
        const email = $('input[name="email"]').val().trim().toLowerCase();
        const phone = $('input[name="phone"]').val().trim();
        const message = $('textarea[name="message"]').val().trim();

        if (!name || !email || !message) {
            alert("Please fill all required fields!");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address!");
            return;
        }

        // Disable submit button to prevent multiple submissions
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.prop('disabled', true).html('Sending... <i class="fa fa-spinner fa-spin"></i>');

        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            alert("Email service is not loaded. Please refresh the page and try again.");
            submitBtn.prop('disabled', false).html(originalText);
            return;
        }

        // Initialize EmailJS if not already done
        if (!emailjsInitialized) {
            initializeEmailJS();
        }

        // Prepare multiple parameter sets to try different variable name patterns
        const templateParamsSet1 = {
            from_name: name,
            from_email: email,
            phone: phone || 'Not provided',
            message: message,
            to_email: 'sc1797569@gmail.com',
            reply_to: email
        };

        const templateParamsSet2 = {
            name: name,
            email: email,
            phone: phone || 'Not provided',
            message: message,
            to_email: 'sc1797569@gmail.com',
            reply_to: email
        };

        const templateParamsSet3 = {
            user_name: name,
            user_email: email,
            user_phone: phone || 'Not provided',
            user_message: message,
            to_email: 'sc1797569@gmail.com'
        };

        // Success handler
        function handleSuccess(response, method) {
            console.log(`✅ SUCCESS with ${method}!`, response.status, response.text);
            document.getElementById("contact-form").reset();
            alert("✅ Form Submitted Successfully! I'll get back to you soon.");
            submitBtn.prop('disabled', false).html(originalText);
        }

        // First try: sendForm method (automatic field mapping)
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, '#contact-form')
        .then(function (response) {
            handleSuccess(response, 'sendForm');
        }, function (error) {
            console.log('sendForm failed, trying send method with different parameter sets...', error);
            
            // Try Set 1
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParamsSet1)
            .then(function (response) {
                handleSuccess(response, 'send method (Set 1)');
            }, function (error1) {
                console.error('Set 1 failed:', error1);
                
                // Try Set 2
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParamsSet2)
                .then(function (response) {
                    handleSuccess(response, 'send method (Set 2)');
                }, function (error2) {
                    console.error('Set 2 failed:', error2);
                    
                    // Try Set 3
                    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParamsSet3)
                    .then(function (response) {
                        handleSuccess(response, 'send method (Set 3)');
                    }, function (error3) {
                        // All attempts failed
                        const lastError = error3 || error2 || error1 || error;
                        console.error('❌ All attempts failed. Last error:', lastError);
                        
                        let errorMsg = "Form submission failed!\n\n";
                        if (lastError.text) {
                            errorMsg += "Error: " + lastError.text + "\n\n";
                        }
                        if (lastError.status) {
                            errorMsg += "Status: " + lastError.status + "\n\n";
                        }
                        errorMsg += "Please verify in EmailJS Dashboard:\n";
                        errorMsg += "1. Service ID: " + EMAILJS_SERVICE_ID + "\n";
                        errorMsg += "2. Template ID: " + EMAILJS_TEMPLATE_ID + "\n";
                        errorMsg += "3. Template should have variables: from_name, from_email, phone, message\n\n";
                        errorMsg += "Please try again or email me directly at sc1797569@gmail.com";
                        
                        alert(errorMsg);
                        submitBtn.prop('disabled', false).html(originalText);
                    });
                });
            });
        });
    });
    // <!-- emailjs to mail contact form data -->

});

// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: [ "full stack web development","react applications","backend api development","building scalable web apps""android development"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

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

fetchData().then(data => {
    showSkills(data);
});

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->
