function clicked(e)
{
    if(!confirm('Are you sure?')) {
        e.preventDefault();
    }
}
